#!python3
# coding=utf-8




# imports no final do arquivo





class ScriptLattesDiff:
    """Classe principal do scriptLattesDiff"""



    def __init__(self):


        # glob de todos os arquivos em Settings.configFilesGlob
        self.filesPath = set(  # para remover duplicatas
                         sum(  # transforma lista de lista em lista
                         [glob.glob(x) for x in Settings.configFilesGlob], []))

        if not self.filesPath:
            # a lista está vazia
            # nenhum arquivo foi encontrado pelo glob
            # devo sair
            Print.erro('Nenhum arquivo de configuração foi encontrado.')
            sys.exit(0)

        # ordeno os arquivos pela nome
        # no nosso caso, o nome contém a data
        # portanto, o índice zero é o mais antigo
        # e o último é o mais recente
        self.filesPath = sorted(self.filesPath)


        if Settings.criarNovoSnapshot:
            # preciso criar mais um arquivo de configuração
            self.criarNovoSnapshot()



    def criarNovoSnapshot(self):
        '''Devo criar um novo Snapshot do scriptLattes
            Exemplo:
                self.filesPath = [
                    'D:/Facul/IC/SSC/20150711/get-ssc.config',
                    'D:/Facul/IC/SSC/20150728/get-ssc.config',
                    'D:/Facul/IC/SSC/20150830/get-ssc.config'
                ]
                Devo criar um novo arquivo de configuração na pasta:
                    'D:/Facul/IC/SSC/DATA_ATUAL/get-ssc.config'
                E adicioná-lo a filesPath'''

        # é o último da lista
        # no nosso exemplo:
        #   D:/Facul/IC/SSC/20150830/get-ssc.config
        maisRecente = list(self.filesPath)[-1]

        # agora eu vou pegar o pathPai que nesse caso seria:
        #   D:/Facul/IC/SSC

        # nesse caso continua sendo o mais recente
        maisRecentePath = Path(maisRecente)
        # pathPai é o q eu procuro
        pathPai = maisRecentePath.parents[1]
        # criando o caminho destino, para onde vai o novoSnap
        # no nosso exemplo:
        #   D:/Facul/IC/SSC/DATAATUAL
        dataAtual = datetime.now().strftime('%Y%m%d')
        # name é o nome do arquivo
        # se maisRecente = D:/Facul/IC/SSC\\20150830\\get-ssc.config
        # name = get-ssc.config
        name = maisRecentePath.name

        # se não foi digitado um caminho novo, devo usar esse caminho aqui
        # ou seja, criarNovoSnapshot é True, então o caminho destino é o padrão
        if Settings.criarNovoSnapshot is True:
            caminhoDest = (pathPai / dataAtual).absolute()
        else:
            caminhoDest = Settings.criarNovoSnapshot
        # listDest no nosso exemplo deve ser:
        #   fileDest = D:/Facul/IC/SSC/DATA_ATUAL/get-ssc.config
        #   listDest = D:/Facul/IC/SSC/DATA_ATUAL/get-ssc.list
        fileDest = caminhoDest / name
        # se baseName = get-ssc
        baseName = os.path.splitext(name)[0]
        listDest = caminhoDest / (baseName + '.list')

        if fileDest.exists() or listDest.exists():
            # o diretório já existe
            Print.erro('Já existe um novo snapshot do scriptLattes.')
            print('Por favor, rode o scriptLattes nesse novo snapshot e o scriptLattesDiff novamente sem a opção de criar um novo snapshot.')
            sys.exit(0)
        # copia de fato
        # cria a pasta primeiro
        if not os.path.exists(str(caminhoDest)):
            os.mkdir(str(caminhoDest))

        # copia o arquivo .config
        shutil.copy(str(maisRecentePath), str(fileDest))

        # copia o arquivo .list
        maisRecenteListPath = os.path.splitext(maisRecente)[0] + '.list'
        shutil.copy(str(maisRecenteListPath), str(listDest))
        print('Arquivo gerado:', fileDest)

        # devo adicionar o novo arquivo para a lista de arquivos a serem analisadas
        self.filesPath.append(str(fileDest))

        # agora eu só preciso ler esse e alterar o que for
        # necessário antes de rodar o scriptLattes
        ConfigFile.criarNovoSnapshot(fileDest, listDest)




    def analisarXml(self):
        section('Analisando arquivos de configuração')
        self.configFiles = [ConfigFile(x) for x in self.filesPath]







    def analisarJsons(self):
        '''
        Compara várias instancias de ConfigFile e retorna um json analisado com a data de cada configFile
        o parametro é uma lista com todos os ConfigFile para analisar
        '''
        section('Função analisar Jsons:')


        Print.warning('Arquivos de configuração carregados:')
        for configFile in self.configFiles:
            print(configFile.filePath, '=> data:', configFile.data_processamento)




        # idLattes começa com os valores padroes da instancia mais nova
        maisAntigo = self.configFiles[0]
        maisRecente = self.configFiles[-1]






        pesquisadores = {} # será um dos objetos de result
        # começa construido os campos que não serão analisados
        # apenas serão copiados do mais novo
        for pesquisador in maisRecente.json:
            pesquisadores[pesquisador] = {}
            for campo in ConfigFile.manterDados['maisNovo']:
                pesquisadores[pesquisador][campo] = maisRecente.json[pesquisador][campo]





        # fazendo a análise parcial
        if Settings.incluirPrimeiroSnap:
            # primeiro, vamos começar com os valores do json mais antigos
            for pesquisador in maisAntigo.json:
                for campo in ConfigFile.manterDados['novosDados']:
                    pesquisadores[pesquisador][campo] = {}
                    if campo in maisAntigo.json[pesquisador]:
                        pesquisadores[pesquisador][campo][maisAntigo.data_processamento] = maisAntigo.json[pesquisador][campo]

        else:
            # aqui eu decidi que não quero manter o mais antigo
            # não preciso mesmo manter ele
            # mas devo criar pesquisadores[pesquisador][campo] = {}
            for pesquisador in maisAntigo.json:
                for campo in ConfigFile.manterDados['novosDados']:
                    pesquisadores[pesquisador][campo] = {}




        # vou usar um contador de índices
        # para calcular a porcentagem de quanto falta
        pesquisadoresCarregados = 0
        # aqui está a parte lenta do código
        # cada loop desse demanda tempo
        # vou calcular quanto tempo
        tempoDecorrido = TempoDecorrido()
        qntConfigFiles = len(self.configFiles)
        # se vou pesquisar menos pesquisadores do q a qntidade atual
        # devo comparar o meno para atingir o 100%
        lenPesquisadores = min(len(pesquisadores), Settings.maxPesquisadores)
        for pesquisador in pesquisadores:

            if Settings.pesquisadoresList:
                # se eu tenho uma lista específica para analisar
                if pesquisador not in Settings.pesquisadoresList:
                    # se o pesquisador atual não está nessa lista
                    # eu pretendo pular ele

                    # agora vamos testar por nome
                    # se na lista de pesquisadores a serem incluidos
                    # tem um nome que se encaixa nesse pesquisador
                    hasNome = False
                    for nome in Settings.pesquisadoresList:
                        
                        if nome in configFile.getPesquisadorNome(pesquisador):
                            hasNome = True
                            break

                    if not hasNome:
                        # ele não tem o nome válido na lista de pesquisadores
                        continue



            if pesquisadoresCarregados >= Settings.maxPesquisadores:
                Print.warning('Quantidade máxima de pesquisadores atingidos')
                break


            configFile.printPesquisador(pesquisador)
            Print.back(colorama.Fore.YELLOW + 'Carregando: '+
                Print.procentagem(pesquisadoresCarregados, lenPesquisadores)+'%' + colorama.Fore.RESET)
            pesquisadoresCarregados += 1


            for campo in ConfigFile.manterDados['novosDados']:


                # pula o primeiro configFile q já foi processado
                i = 1
                while i < qntConfigFiles:
                    # variaveis importantes
                    # configFile sendo analisado nesse momento
                    configFile = self.configFiles[i]
                    configFileAnterior = self.configFiles[i-1]


                    # pega os novos dados que apareceram desta configFile em relação a data anterior
                    # ou seja, a diferença do mais novo em relação ao mais antigo
                    try:
                        diferencas = List.differences(configFileAnterior.json[pesquisador][campo], configFile.json[pesquisador][campo])
                    except Exception as e:
                        section('Erro')
                        print('Em List.differences:')
                        print('Pesquisador:', pesquisador)
                        print('Campo:', campo)
                        print('configFileAnterior:', configFileAnterior.data_processamento)
                        print('configFile:', configFile.data_processamento)
                        raise e
                        exit(0)
                    
                    # diferencas é:
                    # {
                    #   '+': ...,
                    #   '-': ...,
                    #   '~': ...
                    # }
                    # pesquisadores[pesquisador][campo][configFile.data_processamento] é:
                    # pesquisadores[98...]['descricao'][19/19/19] que terá ['+', '-', '~']
                    pesquisadores[pesquisador][campo][configFile.data_processamento] = diferencas
                    if not diferencas:
                        # se não houve diferenças para esta data
                        # removo para n ocupar espaço desnecessário
                        del pesquisadores[pesquisador][campo][configFile.data_processamento]

                    i += 1


                # se depois de toda essa análise com as datas
                # o campo não recebeu nenhum alteração, posso exclui-lo
                if not pesquisadores[pesquisador][campo]:
                    # aqui ele está vazio
                    del pesquisadores[pesquisador][campo]


        # fim de analisar os pesquisadores


        # ditar o fim de imprimir a porcentagem
        # porcentagem eu tava imprimindo assim:
        # Carregando: dd%
        Print.back(colorama.Fore.GREEN+'Terminado!'+colorama.Fore.RESET)
        Print.endBack()

        print(colorama.Fore.GREEN+'Tempo decorrido: '+colorama.Fore.RESET+tempoDecorrido.getFormatted()+'s');


        # reune as principais informações em result
        result = {
            'datasProcessamento': [x.data_processamento for x in self.configFiles], # lista com todas as datas de processamento
            'idLattes': pesquisadores,
            'nomeDoGrupo': maisRecente.getParametro('global-nome_do_grupo'),
        }
        return result





    def hasSameIdLattes(self):
        '''função que diz se todos os arquivos tem os mesmos idLattes'''


        primeiraChave = self.configFiles[0].json.keys()
        chaves = (configFile.json.keys() for configFile in self.configFiles[1:])
        for chave in chaves:
            if primeiraChave != chave:
                return False

        return True











    @staticmethod
    # funções estáticas que não dependem do objeto


    def main():
        scriptLattesDiff = ScriptLattesDiff()


        scriptLattesDiff.analisarXml()


        # se foi carregado apenas um arquivo, não há como fazer análises temporais com ele
        if len(scriptLattesDiff.configFiles) < 2:
            # Não há arquivos de configuração suficientes para comparar.
            Print.erro('Não há arquivos de configuração suficientes para comparar')
            sys.exit(0)



        # teste de pesquisadores no grupo
        if not scriptLattesDiff.hasSameIdLattes():
            Print.erro('Os arquivos XMLs não possuem os mesmos pesquisadores.')
            sys.exit(0)


        # cria as classes com os arquivos de configuração
        jsonAnalisado = scriptLattesDiff.analisarJsons()
        ScriptLattesDiff.saveJsonAnalisado(jsonAnalisado)


        # copia os arquivos para o diretório de saída
        ScriptLattesDiff.copyFilesToOutput()




    def saveJsonAnalisado(jsonAnalisado):
        '''Salva a variável com jsonAnalisado analisados
            Atribua o valor de ConfigFile.analisarJsons a uma variável antes'''

        section('Salvando todos os arquivos e idLattes')
        def tryMakeDir(path):
            try:
                # tenta criar a pasta de saída
                os.makedirs(str(path))
            except:
                pass

        def deleteFolder(path):
            try:
                shutil.rmtree(str(path))
            except:
                pass

        outputFolder = Settings.outputFolder
        tryMakeDir(outputFolder)
        # salvando jsonAnalisado, na pasta jsons
        deleteFolder(outputFolder / 'json')
        tryMakeDir(outputFolder / 'json')




        # salvando arquivo scriptLattesDiff.js
        # savalndo todos os ids
        scriptLattesDiff = {
            'versao': Settings.versao, # versao do scriptLattesDiff que gerou os arquivos json
            'allIdLattes': sorted(jsonAnalisado['idLattes'].keys(),
                key=lambda x: jsonAnalisado['idLattes'][x]['identificacao']['nome_inicial']),
            'datasProcessamento': jsonAnalisado['datasProcessamento'],
            'nomeDoGrupo': jsonAnalisado['nomeDoGrupo']
        }
        Json.writeToJs(str(outputFolder / 'json' / 'scriptLattesDiff.js'), 'scriptLattesDiff', scriptLattesDiff)




        # salvando cada idLattes
        tryMakeDir(str(outputFolder / 'json' / 'idLattes'))
        for idLattes in jsonAnalisado['idLattes']:


            # salva no arquivo
            Json.writeToJs(
                # nome do arquivo
                str(outputFolder / 'json' / 'idLattes' / (idLattes+'.js')),

                # nome da variável
                'scriptLattesDiff.idLattes[\''+idLattes+'\']',

                # conteudo
                jsonAnalisado['idLattes'][idLattes]
            )









    def copyFilesToOutput():


        outputFolder = Settings.outputFolder


        # se o diretorio de saída é o diretorio do script, não precisa copiar
        if Settings.outputFolder == Misc.scriptPath:
            debug('O diretório de saída é o mesmo do scriptLattesDiff')
            return ;





        # copia as seguintes pastas
        copiarPastas = ['html', 'js', 'css', 'vendor', 'php']


        for pasta in copiarPastas:
            src  = str(Misc.scriptPath / pasta)
            dest = str(outputFolder / pasta)
            if os.path.exists(dest):
                shutil.rmtree(dest)


            shutil.copytree(src, dest)


        # move o arquivo redirect para a raíz da pasta output
        shutil.copy(
            str(outputFolder / 'html' / 'redirect.htm'),
            str(outputFolder / 'scriptLattesDiff.htm')
        )
        shutil.move(
            str(outputFolder / 'html' / 'redirect.htm'),
            str(outputFolder / 'index.htm')
        )





import shutil
import os
import glob
from py.ConfigFile import ConfigFile
from py.Settings import Settings
from py.misc import *
from py.List import List
from py.Debug import *
from py.Json import Json
from py.Print import Print
from py.TempoDecorrido import TempoDecorrido
from datetime import datetime
import time
import colorama