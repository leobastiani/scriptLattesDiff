#!python3
# coding=utf-8



class ConfigFile:
    '''Classe que trata um arquivo de configuração'''



    # local do arquivo de configuracao, instancia de Path
    filePath = None
    # parametros carregados do arquivo de configuracao
    parametros = None
    # o arquivo xml carregado de configFile
    xml = None
    # formatacao em json do xml
    json = None
    # data de processamento do grupo
    data_processamento = None






    # as maneiras de como os dados deve ser mantidos na hora da comparação entre configFiles
    manterDados = {
        'novosDados': set([ # set, pois trabalha mais rápido do que uma list
            # aqui, os dados novos repetidos são apagados,
            # e são mantidos apenas os que não estavam presentes
            'colaboradores', 'formacao_academica', 'projetos_pesquisa', 'premios_titulos', 'artigos_em_periodicos', 'livros_publicados', 'capitulos_livros', 'trabalho_completo_congresso', 'resumo_expandido_congresso', 'resumo_congresso', 'producao_bibliografica', 'trabalhos_tecnicos', 'producao_tecnica', 'orientacao_doutorado_em_andamento', 'orientacao_mestrado_em_andamento', 'orientacao_doutorado_concluido', 'orientacao_mestrado_concluido', 'orientacao_tcc_concluido', 'orientacao_iniciacao_cientifica_concluido', 'organizacao_evento', 'orientacao_especializacao_concluido', 'orientacao_tcc_em_andamento', 'produto_tecnologico', 'supervisao_pos_doutorado_concluido', 'orientacao_outros_tipos_concluido', 'supervisao_pos_doutorado_em_andamento', 'producao_artistica', 'orientacao_iniciacao_cientifica_em_andamento', 'artigos_em_revista', 'processo_tecnica', 'texto_em_jornal', 'orientacao_outros_tipos_em_andamento', 'participacao_evento', 'apresentacao_trabalho'
        ]),
        'maisNovo': [
            # aqui ficam os dados que não são necessários para comparação
            'identificacao', 'idiomas', 'endereco', 'area_atuacao'
        ]
    }









    def __init__(self, filePath):
        '''filePath é o path do arquivo de configuração'''

        self.filePath = Path(os.getcwd(), filePath).absolute()
        section('Novo arquivo de configuração carregado:', self.filePath)
        with open(filePath, 'r') as fp:
            self.carregarParametros(fp)
        self.loadXml()
        self.data_processamento = self.xml.getroot().attrib['data_processamento']
        # obtem uma instancia de time pela data de processamento
        self.time = self.strToData(self.data_processamento)
        self.loadJsonFromXml()




    def printPesquisador(self, pesquisador):
        '''Imprime numa linha o dicionário pesquisador com o ID e o nome
        param: pesquisador => Id do pesquisador'''
        print(colorama.Fore.GREEN+'Pesquisador: '+colorama.Fore.RESET+pesquisador+
            ', '+colorama.Fore.GREEN+'Nome: '+colorama.Fore.RESET+self.getPesquisadorNome(pesquisador))



    def getPesquisadorNome(self, pesquisador):
        return self.json[pesquisador]['identificacao']['nome_inicial']



    def carregarParametros(self, fp):
        '''Carrega as configurações para a variável parametros do arquivo de configuração'''
        # função obtida do scriptLattes
        self.parametros = {}
        def getParametro(line):
            '''Retorna uma tupla (nomeDoParametro, valor)
            ou (False, False) caso erro'''
            line = line.strip() # remove o \n do final da linha
            line = line.partition('#')[0] # remove os comentários
            lineDiv = line.split('=') # obtem uma linha dividida
            if len(lineDiv) == 2:
                return lineDiv[0].strip(), lineDiv[1].strip()
            else:
                return False, False
        for line in fp:
            paramName, value = getParametro(line)
            if paramName:
                self.parametros[paramName] = value








    def getParametro(self, paramName):
        '''Obtem um parâmetro do arquivo de configuração'''
        return self.parametros[paramName]





    def getOutputFolder(self):
        '''Retorna o Path da pasta de saída do arquivo de configuração'''
        # começa contando de sys.argv[0] que é o path do script .py
        return Misc.scriptPath / self.getParametro('global-diretorio_de_saida')







    def getXmlFilePath(self):
        return (self.getOutputFolder() / (self.getParametro('global-prefixo')+'-database.xml')).absolute()







    def loadXml(self):
        xmlFilePath = self.getXmlFilePath()
        print(colorama.Fore.YELLOW+'Carregando arquivo xml:'+colorama.Fore.RESET, self.getXmlFilePath())
        if not os.path.exists(str(xmlFilePath)):
            print('O arquivo XML "%s" não existe.' % str(xmlFilePath))
            print('Por favor, rode o scriptLattes para esse arquivo de configuração: %s' % str(self.filePath))
            sys.exit(0)


        # no xml que o scriptLattes gera
        # o caracter & não é substituido por
        # &amp;
        # vamos verificar se existe o text &amp;
        # se não, vamos substituir todos os
        # & por &amp;
        with open(str(xmlFilePath), 'r', encoding='utf-8') as file:
            fileContent = file.read()
        
        if '&amp;' not in fileContent:
            # esse arquivo precisa trocar & por &amp;
            fileContent = fileContent.replace('&', '&amp;')
            # agora é só salvar no arquivo
            with open(str(xmlFilePath), 'w', encoding='utf-8') as file:
                file.write(fileContent)


        self.xml = ElementTree.parse(str(xmlFilePath))
        return self.xml






    def loadJsonFromXml(self):
        root = self.xml.getroot()
        self.json = {}

        def childText(child):
            '''Retorna a string existente dentro de um child
            exemplo: <child>Oi, texto! <i>ComoVai</i>, <b>Por que deixaram isso?</b></child>
            retorna: Oi, texto! ComoVai, Por que deixaram isso?'''
            return "".join(child.itertext())

        def childNomeComum(xml):
            children = xml.getchildren()
            if len(children) < 2:
                return ''
            elif children[0].tag == children[1].tag:
                return children[0].tag
            return ''

        def _xmlToJson(xml, profundidade=1):
            result = {}
            if not xml.getchildren():
                # se for o último filho, retorna seu valor
                return childText(xml)

            # eu tenho filhos!!
            if profundidade >= 4:
                # mas provavelmente, meu filho é um <i> ou <b>
                return childText(xml)


            # se não for filho, retorna um dicionário
            for child in xml:
                if result.get(child.tag):
                    # se já existe esse elemento dentro de result
                    # soma-se o resultado ao vetor
                    result[child.tag] += [_xmlToJson(child, profundidade+1)]
                else:
                    # se não, cria um novo vetor
                    result[child.tag] = [_xmlToJson(child, profundidade+1)]
            return result


        def compactJson(json):
            '''Os valores de json estão sempre em listas
            esta função deixa o que é lista como lista
            e o que não deve ser lista, como elemento único'''
            # apos ter recebidos todos os parametros
            # deixa o que é lista, e retira a lista de qm precisa
            tratarComoLista = ConfigFile.manterDados['novosDados'].union(['colaboradores', 'idiomas', 'area_atuacao'])
            for child in tratarComoLista:
                # verifica se child esta em json
                if child in json:
                    # apenas ovtem o elemento correto
                    json[child] = list(json[child][0].values())[0]
                    # os elementos desse json são um array, deixa como valores simples
                    if child in ['colaboradores', 'idiomas', 'area_atuacao']:
                        continue
                    for i in json[child]:
                        for filho in i:
                            i[filho] = i[filho][0]
                else:
                    # cria um novo elemento para ter sempre todos os elementos para comparar
                    json[child] = []
            # agora, compara os childs se não são listas
            def naoSaoListas(json):
                if isinstance(json, str):
                    # cheguei numa string já, não preciso continuar
                    return
                for child in json:
                    if child not in tratarComoLista:
                        json[child] = json[child][0]
                        # chama recursivo para os filhos dele
                        naoSaoListas(json[child])
            naoSaoListas(json)

        for pesquisador in root:
            i = pesquisador.attrib['id'] # deve ser tratado como string

            Print.back('Analisando: %s Data: %s' % (i, self.data_processamento))

            # para evitar o caso de 0001
            # se tornar 1, porque é inteiro
            self.json[i] = _xmlToJson(pesquisador)
            compactJson(self.json[i])

            # antes eu imprimia os idLattes nesse ponto
            # porém, é muito rápida a leitura
            # nem vale a pena imprimir
            # self.printPesquisador(i)
        
        Print.back('Completado')
        Print.endBack()
        return self.json










    def __str__(self):
        return str(self.filePath)









    @staticmethod

    def strToData(str):
        '''Transfomr uma string obtida dos arquivos XML do scriptLattes
        Exemplo de String: 01/01/1970 23:59:59'''
        return time.strptime(str, '%d/%m/%Y %H:%M:%S')


    def criarNovoSnapshot(novoArquivoConfig, novoArquivoList):
        '''Seta os parametros do novoArquivoConfig de acordo com a data atual
            Exemplo:
                novoArquivoConfig = Path(...) # arquivo na pasta com a data atual
                Devo ler o arquivo e alterar o que for necessário para
                Rodar o scriptLattes novamente com esse arquivo'''

        # todo comando é do tipo:
        #   (palavra) = (palavra) # (comentários)
        reComando = re.compile(r'([^=]+)\=([^#]+)?(?:#(.*))?')
        # lendo todas as linhas do arquivo
        with open(str(novoArquivoConfig), 'r', encoding='utf-8') as file:
            lines = file.readlines()

        # como exeplo:
        #   D:/Facul/IC/SSC/DATA_ATUAL/
        dirName = novoArquivoConfig.parents[0]

        # analisa todas as linhas do arquivo
        i = 0 # contador com a lista
        for line in lines:
            sintaxe = re.match(reComando, line)
            if sintaxe:
                # na sintaxe, vamos obter
                #   (strComando) = (strValor) # (strComentarios)
                sintaxeGroups = sintaxe.groups()
                strComando = sintaxeGroups[0].strip()
                strValor = sintaxeGroups[1].strip()
                initStrValor = strValor
                strComentarios = sintaxeGroups[2]
                
                # vou tratar somente os comandos que preciso
                if strComando == 'global-arquivo_de_entrada':
                    # onde está o arquivo de lista novo
                    strValor = str(novoArquivoList)

                elif strComando == 'global-diretorio_de_saida':
                    # onde está o direitório de saída?
                    # no mesmo lugar desse arquivo
                    strValor = str(novoArquivoConfig.parents[0])

                elif strComando == 'global-itens_ate_o_ano':
                    strValor = '' # poderia deixar até o ano atual, mas não preferi: datetime.now().strftime('%Y')

                
                elif strComando == 'global-arquivo_qualis_de_periodicos':
                    # junta o dirName do novo arquivo
                    # exemplo: D:/Facul/IC/SSC/DATA_ATUAL/
                    # com o nome do aruqivo
                    # exemplo: qualis_computacao_periodicos_2013.csv
                    strValor = str(Path(dirName) / (Path(strValor).name))

                elif strComando == 'global-arquivo_qualis_de_congressos':
                    # igual ao elif de cima
                    strValor = str(Path(dirName) / (Path(strValor).name))


                # se o valor foi alterado, a linha de comando tmb é alterada
                # portanto, vamos fazer essa verificação
                if strValor != initStrValor:
                    # devo alterar a linha
                    lines[i] = sintaxeGroups[0] + '= ' + strValor

                    # se houver comentários devo adicioná-los
                    if strComentarios is not None:
                        lines[i] += ' #' + sintaxeGroups[2]
                    # preciso adicionar um \n
                    lines[i] += '\n'
            i += 1

        newContent = ''.join(lines)
        # só salvar no arquivo o novo conteúdo
        with open(str(novoArquivoConfig), 'w', encoding='utf-8') as file:
            file.write(newContent)

        Print.success('Novas configurações salvas no arquivo!')
        print('Por favor, execute o scriptLattes com a linha de comando:')
        comando = Misc.strExecutarScriptLattes(novoArquivoConfig)
        print(comando)
        print('Deseja executá-lo? (y/n)')
        resp = Misc.respostaYN()
        if resp:
            os.system(comando)
        else:
            sys.exit(0)

        # agora que eu ja executei o scriptLattes
        # posso me executar de novo
        # mas tem um detalhe, nao preciso mais criar o novo arquivo
        Settings.criarNovoSnapshot = False
        print('Deseja executar o scriptLattesDiff com as mesmas configurações? (y/n)')
        resp = Misc.respostaYN()
        if resp:
            ScriptLattesDiff.main()

        sys.exit(0)





import time
import re
import os
import xml.etree.ElementTree as ElementTree
from pathlib import Path
from py.misc import *
import colorama
from py.Print import Print
from py.ScriptLattesDiff import ScriptLattesDiff