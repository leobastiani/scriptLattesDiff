#!python3
# coding=utf-8




# imports no final do arquivo





class ScriptLattesDiff:
    '''Classe principal do scriptLattesDiff'''



    def __init__(self):


        # glob de todos os arquivos em Settings.configFilesGlob
        todosOsArquivos = sum(  # transforma lista de lista em lista
                         [glob.glob(x) for x in Settings.configFilesGlob], [])

        if Settings.listGlob:
            print('Diretório atual: '+os.getcwd())
            print('Arquivos encontrados:')
            for arquivo in todosOsArquivos:
                print('\t'+arquivo)
            sys.exit(0)

        self.filesPath = set(  # para remover duplicatas
                         todosOsArquivos)

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
        maisRecente = str(self.configFiles[-1].filePath.absolute())

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

        # se baseName = get-ssc
        baseName = os.path.splitext(name)[0]

        # copia o arquivo .list
        maisRecenteListPath = os.path.splitext(maisRecente)[0] + '.list'

        if Settings.getFileListPath:
            # quero só imprimir o arquivo de lista mais recente
            print('Arquivo de lista mais recente:')
            print(maisRecenteListPath)
            sys.exit(0)

        # listDest no nosso exemplo deve ser:
        #   fileDest = D:/Facul/IC/SSC/DATA_ATUAL/get-ssc.config
        #   listDest = D:/Facul/IC/SSC/DATA_ATUAL/get-ssc.list
        fileDest = caminhoDest / name
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
        print('Arquivo .config gerado => de: "%s" => "%s"' % (fileDest, str(maisRecentePath)))
        if Settings.fileListPath:
            # copio o arquivo de lista de um novo lugar
            shutil.copy(str(Settings.fileListPath), str(listDest))
            print('Arquivo .list gerado => de: "%s" => "%s"' % (listDest, str(Settings.fileListPath)))
        else:
            # copio o arquivo de lista do mais recente
            shutil.copy(str(maisRecenteListPath), str(listDest))
            print('Arquivo .list gerado => de: "%s" => "%s"' % (listDest, str(maisRecenteListPath)))

        # devo adicionar o novo arquivo para a lista de arquivos a serem analisadas
        self.filesPath.append(str(fileDest))

        # agora eu só preciso ler esse e alterar o que for
        # necessário antes de rodar o scriptLattes
        ConfigFile.criarNovoSnapshot(fileDest, listDest)




    def analisarXml(self):
        section('Analisando arquivos de configuração')
        self.configFiles = [ConfigFile(x) for x in self.filesPath]
        # ordeno os configs files de acordo com as datas
        self.configFiles = sorted(self.configFiles, key=lambda x: x.getDate())







    def analisarJsons(self):
        '''
        Compara várias instancias de ConfigFile e retorna um json analisado com a data de cada configFile
        o parametro é uma lista com todos os ConfigFile para analisar
        '''


        def elemVazioBug(elem):
            '''um bug que tudo fica vazio, e o ano é zero'''
            for campo in elem:
                if campo == 'ano':
                    if elem[campo] != '0':
                        return False

                elif elem[campo] != '':
                    return False
            return True


        section('Função analisar Jsons:')


        Print.warning('Arquivos de configuração carregados:')
        for configFile in self.configFiles:
            print(configFile.filePath, '=> data:', configFile.data_processamento)



        # idLattes começa com os valores padroes da instancia mais nova
        maisAntigo = self.configFiles[0]
        maisRecente = self.configFiles[-1]
        segundoMaisRecente = self.configFiles[-2]






        pesquisadores = {} # será um dos objetos de result
        # começa construido os campos que não serão analisados
        # apenas serão copiados do mais novo
        for pesquisador in maisRecente.json:

            if pesquisador not in segundoMaisRecente.json:
                # é um novo pesquisador, não vou analisá-lo agora
                continue

            if not Settings.pesquisadorNaListaPermitidos(maisRecente, pesquisador):
                # se o pesquisador não está na lista, passo para o próximo
                continue

            pesquisadores[pesquisador] = {}
            for campo in ConfigFile.manterDados['maisNovo']:
                pesquisadores[pesquisador][campo] = maisRecente.json[pesquisador][campo]





        # fazendo a análise parcial
        if Settings.incluirPrimeiroSnap:
            # primeiro, vamos começar com os valores do json mais antigos
            for pesquisador in pesquisadores:

                if pesquisador not in maisAntigo.json:
                    # este pesquisador está no mais recente
                    # mas não está no mais antigo
                    continue

                for campo in ConfigFile.manterDados['novosDados']:
                    pesquisadores[pesquisador][campo] = {}
                    if campo in maisAntigo.json[pesquisador]:
                        pesquisadores[pesquisador][campo][maisAntigo.data_processamento] = maisAntigo.json[pesquisador][campo]

        else:
            # aqui eu decidi que não quero manter o mais antigo
            # não preciso mesmo manter ele
            # mas devo criar pesquisadores[pesquisador][campo] = {}
            for pesquisador in pesquisadores:

                if pesquisador not in segundoMaisRecente.json:
                    # este pesquisador está no mais recente
                    # mas não está no mais antigo
                    continue

                if not Settings.pesquisadorNaListaPermitidos(maisRecente, pesquisador):
                    # se o pesquisador não está na lista, passo para o próximo
                    continue

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
            # exemplo:
            # pesquisador = 7137178343756327

            if not Settings.pesquisadorNaListaPermitidos(configFile, pesquisador):
                # se o pesquisador não está na lista, passo para o próximo
                continue


            if pesquisadoresCarregados >= Settings.maxPesquisadores:
                Print.warning('Quantidade máxima de pesquisadores atingidos')
                break


            configFile.printPesquisador(pesquisador)
            Print.back(colorama.Fore.YELLOW + 'Carregando: '+
                Print.procentagem(pesquisadoresCarregados, lenPesquisadores)+'%' + colorama.Fore.RESET)
            pesquisadoresCarregados += 1


            if Settings.campos:
                # vou analisar campos específicos
                camposAnalise = [x for x in Settings.campos if x in ConfigFile.manterDados['novosDados']]
            else:
                camposAnalise = ConfigFile.manterDados['novosDados']

            # pula o primeiro configFile q já foi processado
            for i in range(1, qntConfigFiles):
                # variaveis importantes
                # configFile sendo analisado nesse momento
                configFile = self.configFiles[i]
                configFileAnterior = self.configFiles[i-1]

                if pesquisador not in configFile.json or pesquisador not in configFileAnterior.json:
                    # é um novo pesquisador
                    # nao preciso analisá-lo
                    continue

                for campo in camposAnalise:


                    # pega os novos dados que apareceram desta configFile em relação a data anterior
                    # ou seja, a diferença do mais novo em relação ao mais antigo
                    try:
                        diferencas = List.differences(configFileAnterior.json[pesquisador][campo], configFile.json[pesquisador][campo])
                    
                        # diferencas é:
                        # {
                        #   '+': ...,
                        #   '-': ...,
                        #   '~': ...
                        # }
                        # pesquisadores[pesquisador][campo][configFile.data_processamento] é:
                        # pesquisadores[98...]['descricao'][19/19/19] que terá ['+', '-', '~', '>']
                        pesquisadores[pesquisador][campo][configFile.data_processamento] = diferencas
                        if not diferencas:
                            # se não houve diferenças para esta data
                            # removo para n ocupar espaço desnecessário
                            del pesquisadores[pesquisador][campo][configFile.data_processamento]
                        else:
                            # testo as diferenças
                            # para remover o bug de campos vazios
                            if campo != 'colaboradores':
                                # esse bug não acontece com os colaboradores
                                for sinal in ['+', '-']:
                                    # apenas os sinais de + e -
                                    for i in range(len(diferencas[sinal])-1, -1, -1):
                                        elem = diferencas[sinal][i]
                                        # para os elementos
                                        if elemVazioBug(elem):
                                            diferencas[sinal].remove(elem)
                                    

                    except Exception as e:
                        section('Erro')
                        print('Em List.differences:')
                        print('Pesquisador:', pesquisador)
                        print('Campo:', campo)
                        print('configFileAnterior:', configFileAnterior.data_processamento)
                        print('configFile:', configFile.data_processamento)
                        raise e
                        exit(0)

                    # fim do try

                # fim do for de configFile
            # fim do for de pesquisador


            # agora que analisamos as diferenças, vamos analisar os movidos
            # que é pegar as diferenças e calcular outras diferenças
            for campoRemovido, campoAcrescido in ConfigFile.manterDados['movidos']:

                # não vamos ter movidos se tanto os campos não possuirem elementos
                if campoRemovido not in pesquisadores[pesquisador] or campoAcrescido not in pesquisadores[pesquisador]:
                    continue


                # agora vamos analisar as datas em igual
                # exemplo: campoRemovido = 'artigos_em_revista' e campoAcrescido = 'artigos_em_periodicos'
                # datas removidos: [data1, data2, data5, data6, data7]
                datasRemovidos = pesquisadores[pesquisador][campoRemovido].keys()
                # datas acrescidos: [data1, data2, data9, data10, data11]
                datasAcrescidos = pesquisadores[pesquisador][campoAcrescido].keys()
                # datas iguais: [data1, data2]
                datasIguais = [dataIgual for dataIgual in datasRemovidos if dataIgual in datasAcrescidos]

                
                for dataIgual in datasIguais:
                    # deve haver algo removido nos removidos e deve haver algo acrescido no acrescidos
                    if '-' not in pesquisadores[pesquisador][campoRemovido][dataIgual] or '+' not in pesquisadores[pesquisador][campoAcrescido][dataIgual]:
                        # tento a próxima data
                        continue

                    # agora precisamos remover os similares
                    pesquisadores[pesquisador][campoAcrescido][dataIgual]['>'] = List.removeSimilares(pesquisadores[pesquisador][campoRemovido][dataIgual]['-'], pesquisadores[pesquisador][campoAcrescido][dataIgual]['+'])


        # fim de analisar os pesquisadores
        Dict.compact(pesquisadores)

        # ditar o fim de imprimir a porcentagem
        # porcentagem eu tava imprimindo assim:
        # Carregando: dd%
        Print.back(colorama.Fore.GREEN+'Terminado!'+colorama.Fore.RESET)
        Print.endBack()

        print(colorama.Fore.GREEN+'Tempo decorrido: '+colorama.Fore.RESET+tempoDecorrido.getFormatted()+'s');


        # reune as principais informações em result
        # reune as principais informações em result
        result = {
            'datasProcessamento': [x.data_processamento for x in self.configFiles], # lista com todas as datas de processamento
            'idLattes': pesquisadores,
            'nomeDoGrupo': maisRecente.getParametro('global-nome_do_grupo'),
        }
        return result










    @staticmethod
    # funções estáticas que não dependem do objeto


    def main():
        scriptLattesDiff = ScriptLattesDiff()


        scriptLattesDiff.analisarXml()


        if Settings.criarNovoSnapshot:
            # preciso criar mais um arquivo de configuração
            scriptLattesDiff.criarNovoSnapshot()


        # se foi carregado apenas um arquivo, não há como fazer análises temporais com ele
        if len(scriptLattesDiff.configFiles) < 2:
            # Não há arquivos de configuração suficientes para comparar.
            Print.erro('Não há arquivos de configuração suficientes para comparar')
            sys.exit(0)


        # cria as classes com os arquivos de configuração
        jsonAnalisado = scriptLattesDiff.analisarJsons()
        ScriptLattesDiff.saveJsonAnalisado(jsonAnalisado)

        tentativasSalvar = 0
        maxTentativas = 10
        while True:
            try:
                # copia os arquivos para o diretório de saída
                ScriptLattesDiff.copyFilesToOutput()
                # esta função é chamada assim que o objeto é destruido
                Debug.saveFiles()
            except:
                Print.erro('Erro ao salvar.')
                tentativasSalvar += 1
                if tentativasSalvar >= maxTentativas:
                    break # tentei demais :/
                # espera 5 segundos
                time.sleep(5)
                continue


            # não preciso mais tentar inserir
            break




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
from py.Dict import Dict
from py.Print import Print
from py.TempoDecorrido import TempoDecorrido
from datetime import datetime
import colorama
import time