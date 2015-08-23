#!python3
# coding=iso-8859-15
import sys
import glob
import json
import time
import os
from pathlib import Path
import xml.etree.ElementTree as ElementTree
from py.misc import *

# variaveis para depuração
idLattesAdes = '9836776931160228'
idSeiji = '3030047284254233'

class ConfigFile:
    '''Classe que trata um arquivo de configuração'''
    filePath = None # local do arquivo de configuracao, instancia de Path
    parametros = None # parametros carregados do arquivo de configuracao
    xml = None # o arquivo xml carregado de configFile
    json = None # formatacao em json do xml
    data_processamento = None # data de processamento do grupo
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
        self.filePath = Path(os.getcwd(), filePath)
        section('Novo arquivo de configuração carregado:', self.filePath)
        with open(filePath, 'r') as fp:
            self.carregarParametros(fp)
        self.loadXml()
        self.data_processamento = self.xml.getroot().attrib['data_processamento']
        # obtem uma instancia de time pela data de processamento
        self.time = self.strToData(self.data_processamento)
        self.loadJsonFromXml()

    def carregarParametros(self, fp):
        '''Carrega as configurações para a variável parametros do arquivo de configuração'''
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
        # começa contando de __file__ que é o path do script .py
        return Path(__file__).parents[0] / self.getParametro('global-diretorio_de_saida')

    def getXmlFilePath(self):
        return self.getOutputFolder() / (self.getParametro('global-prefixo')+'-database.xml')

    def loadXml(self):
        xmlFilePath = self.getXmlFilePath()
        debug('Carregando arquivo xml: ', self.getXmlFilePath())
        self.xml = ElementTree.parse(str(xmlFilePath))
        return self.xml

    def loadJsonFromXml(self):
        root = self.xml.getroot()
        self.json = {}

        def childNomeComum(xml):
            children = xml.getchildren()
            if len(children) < 2:
                return ''
            elif children[0].tag == children[1].tag:
                return children[0].tag
            return ''

        def _xmlToJson(xml):
            result = {}
            # se for filho, retorna seu valor
            if not xml.getchildren():
                return xml.text if xml.text else ''
            # se não for filho, retorna um dicionário
            for child in xml:
                if result.get(child.tag):
                    # se já existe esse elemento dentro de result
                    # soma-se o resultado ao vetor
                    result[child.tag] += [_xmlToJson(child)]
                else:
                    # se não, cria um novo vetor
                    result[child.tag] = [_xmlToJson(child)]
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
            # para evitar o caso de 0001
            self.json[i] = _xmlToJson(pesquisador)
            compactJson(self.json[i])
            debug('Pesquisador encontrado: %s, Nome: %s' % (i, self.json[i]['identificacao']['nome_inicial']))
        return self.json

    @staticmethod
    def strToData(str):
        '''Transfomr uma string obtida dos arquivos XML do scriptLattes
        Exemplo de String: 01/01/1970 23:59:59'''
        return time.strptime(str, '%d/%m/%Y %H:%M:%S')

    def analisarJsons(configFiles):
        '''
        Compara várias instancias de ConfigFile e retorna um json analisado com a data de cada configFile
        o parametro é uma lista com todos os ConfigFile para analisar
        '''
        # ordena o vetor pela data
        configFiles = sorted(configFiles, key=lambda configFile: configFile.time)
        section('Comparando configFiles:')
        debug('Arquivos:')
        for configFile in configFiles:
            debug(configFile.filePath, '=> data:', configFile.data_processamento)
        # idLattes começa com os valores padroes da instancia mais nova
        maisAntigo = configFiles[0]
        maisRecente = configFiles[-1]
        idLattes = {} # será um dos objetos de result
        for pesquisador in maisRecente.json:
            idLattes[pesquisador] = {}
            for campo in ConfigFile.manterDados['maisNovo']:
                idLattes[pesquisador][campo] = maisRecente.json[pesquisador][campo]

        # fazendo a análise parcial
        # primeiro, vamos começar com os valores do json mais antigos
        for pesquisador in maisAntigo.json:
            for campo in ConfigFile.manterDados['novosDados']:
                idLattes[pesquisador][campo] = {}
                if campo in maisAntigo.json[pesquisador]:
                    idLattes[pesquisador][campo][maisAntigo.data_processamento] = maisAntigo.json[pesquisador][campo]


        # os demais jsons devem comparar os resultados com os campos processados nas linhas acimas
        def diff(a, b):
            '''Diz a diferença de A - B'''
            return [aa for aa in a if aa not in b]

        # pula o primeiro configFile q já foi processado
        i = 1
        while i < len(configFiles):
            configFile = configFiles[i]
            configFileAnterior = configFiles[i-1]
            for pesquisador in configFile.json:
                for campo in ConfigFile.manterDados['novosDados']:
                    # pega os novos dados que apareceram desta configFile em relação a data anterior
                    # ou seja, a diferença do mais novo em relação ao mais antigo
                    acrescido = diff(configFile.json[pesquisador][campo], configFileAnterior.json[pesquisador][campo])
                    subtraido = diff(configFileAnterior.json[pesquisador][campo], configFile.json[pesquisador][campo])
                    # cria um dict para saber o que foi acrescido e o que não foi
                    idLattes[pesquisador][campo][configFile.data_processamento] = {}
                    # para n ter q ficar digitando esse campo gigantesco, só armazenei ele numa variável
                    campoAtual = idLattes[pesquisador][campo][configFile.data_processamento]
                    if acrescido:
                        # se houver algo que foi acrescido
                        campoAtual['+'] = acrescido
                    if subtraido:
                        # se houver alguma coisa que foi subtraida
                        campoAtual['-'] = subtraido
                    if not campoAtual:
                        # se campo atual está vazio, removo para n ocupar espaço desnecessário
                        del idLattes[pesquisador][campo][configFile.data_processamento]
            i += 1
        # reune as principais informações em result
        result = {
            'datasProcessamento': [x.data_processamento for x in configFiles], # lista com todas as datas de processamento
            'idLattes': idLattes,
            'nomeDoGrupo': maisRecente.getParametro('global-nome_do_grupo')
        }
        return result

    def saveJsonAnalisado(jsonAnalisado):
        '''Salva a variável com jsonAnalisado analisados
            Atribua o valor de ConfigFile.analisarJsons a uma variável antes'''

        section('Salvando todos os arquivos e idLattes')
        def tryMakeDir(path):
            try:
                # tenta criar a pasta de saída
                os.mkdir(str(path))
            except:
                pass

        global Settings
        outputFolder = Settings['outputFolder']
        tryMakeDir(outputFolder)

        # salvando jsonAnalisado, na pasta jsons
        tryMakeDir(outputFolder / 'json')
        # salvando arquivo scriptLattesDiff.js
        with open(str(outputFolder / 'json' / 'scriptLattesDiff.js'), 'w', encoding='utf-8') as file:
            # savalndo todos os ids
            scriptLattesDiff = {
                'idLattes': {}, # todos os idLattes analisados
                'allIdLattes': sorted(jsonAnalisado['idLattes'].keys(),
                    key=lambda x: jsonAnalisado['idLattes'][x]['identificacao']['nome_inicial']),
                'datasProcessamento': jsonAnalisado['datasProcessamento'],
                'nomeDoGrupo': jsonAnalisado['nomeDoGrupo']
            }
            file.write("var scriptLattesDiff = %s;" % json.dumps(scriptLattesDiff))
        # salvando cada idLattes
        tryMakeDir(str(outputFolder / 'json' / 'idLattes'))
        for idLattes in jsonAnalisado['idLattes']:
            with open(str(outputFolder / 'json' / 'idLattes' / (idLattes+'.js')), 'w', encoding='utf-8') as file:
                file.write('scriptLattesDiff.idLattes[\'%s\'] = %s;' % (idLattes, json.dumps(jsonAnalisado['idLattes'][idLattes])))

def main(configFilesGlob):
    # glob de todos os arquivos em configFilesGlob
    section('Analisando arquivos de configuração')
    configFilesPath = set(  # para remover duplicatas
                      sum(  # transforma lista de lista em lista
                      [glob.glob(x) for x in configFilesGlob], []))
    print('Arquivos de configuração encontrados: ')
    for file in configFilesPath:
        print(file)

    # se foi carregado apenas um arquivo, não há como fazer análises temporais com ele
    if len(configFilesPath) < 2:
        # Não há arquivos de configuração suficientes para comparar.
        print('Não há arquivos de configuração suficientes para comparar')
        exit()

    # cria as classes com os arquivos de configuração
    configFiles = [ConfigFile(x) for x in configFilesPath]
    jsonAnalisado = ConfigFile.analisarJsons(configFiles)
    ConfigFile.saveJsonAnalisado(jsonAnalisado)


def setSettings(args):
    global Settings
    def nextArg(args):
        try:
            return args[i+1]
        except:
            print('Erro após a leitura do parâmetro "%s"' % args[i])
            sys.exit(0)

    i = 0
    while i < len(args):
        arg = args[i]
        if arg == '--help':
            print('Comando help:')
            sys.exit(0)
        elif arg == '--debug':
            setDebug(True)
            debug('Debug ativado')
        elif arg == '--output-folder' or arg == '-o':
            Settings['outputFolder'] = nextArg(i, args)
            i += 1
        # insira mais comandos por parametro acima
        elif arg[0:1] == '-': # comando inválido
            print('Comando "%s" inválido' % arg)
            sys.exit(0)
        else:
            # todos os arquivos que serão analisados passa por aqui
            configFilesGlob.append(arg)
        i+=1

if __name__ == '__main__':
    section('Apresentação do scriptLattesDiff')

    configFilesGlob = []  # arquivos XMLs que serão analisados pelo script
    Settings = { # todas as configurações do programa
        'outputFolder': Path(Path(__file__).parents[0]) # deve ser um objeto de Path
    }

    # analisando os parâmetros
    if len(sys.argv) < 2:
        print('Messagem de apenas um argumento')
        sys.exit(0)

    setSettings(sys.argv[1:])
    main(configFilesGlob)
