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







    def analisarXml(self):
        self.configFiles = [ConfigFile(x) for x in self.filesPath]







    def analisarJsons(self):
        '''
        Compara várias instancias de ConfigFile e retorna um json analisado com a data de cada configFile
        o parametro é uma lista com todos os ConfigFile para analisar
        '''



        # ordena o vetor pela data
        self.configFiles = sorted(self.configFiles, key=lambda configFile: configFile.time)



        section('Comparando self.configFiles:')




        print('Arquivos:')
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
        # primeiro, vamos começar com os valores do json mais antigos
        for pesquisador in maisAntigo.json:
            for campo in ConfigFile.manterDados['novosDados']:
                pesquisadores[pesquisador][campo] = {}
                if campo in maisAntigo.json[pesquisador]:
                    pesquisadores[pesquisador][campo][maisAntigo.data_processamento] = maisAntigo.json[pesquisador][campo]








        for pesquisador in pesquisadores:
            configFile.printPesquisador(pesquisador)





            # pula o primeiro configFile q já foi processado
            i = 1
            while i < len(self.configFiles):
                # variaveis importantes
                configFile = self.configFiles[i]
                configFileAnterior = self.configFiles[i-1]




                for campo in ConfigFile.manterDados['novosDados']:
                    # pega os novos dados que apareceram desta configFile em relação a data anterior
                    # ou seja, a diferença do mais novo em relação ao mais antigo
                    acrescido, subtraido = List.differences(configFileAnterior.json[pesquisador][campo], configFile.json[pesquisador][campo])
                    # cria um dict para saber o que foi acrescido e o que não foi
                    pesquisadores[pesquisador][campo][configFile.data_processamento] = {}
                    # para n ter q ficar digitando esse campo gigantesco, só armazenei ele numa variável
                    campoAtual = pesquisadores[pesquisador][campo][configFile.data_processamento]
                    if acrescido:
                        # se houver algo que foi acrescido
                        campoAtual['+'] = acrescido
                    if subtraido:
                        # se houver alguma coisa que foi subtraida
                        campoAtual['-'] = subtraido
                    if not campoAtual:
                        # se campo atual está vazio, removo para n ocupar espaço desnecessário
                        del pesquisadores[pesquisador][campo][configFile.data_processamento]






                i += 1






        # reune as principais informações em result
        result = {
            'datasProcessamento': [x.data_processamento for x in self.configFiles], # lista com todas as datas de processamento
            'idLattes': pesquisadores,
            'nomeDoGrupo': maisRecente.getParametro('global-nome_do_grupo')
        }
        return result





    def hasSameIdLattes(self):
        '''função que diz se todos os arquivos tem o mesmo idLattes'''


        primeiraChave = self.configFiles[0].json.keys()
        chaves = (configFile.json.keys() for configFile in self.configFiles[1:])
        for chave in chaves:
            if primeiraChave != chave:
                return False

        return True







    def __del__(self):
        '''esta função é chamada assim que o objeto é destruido'''
        Debug.saveFiles()





    @staticmethod
    # funções estáticas que não dependem do objeto






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

        outputFolder = Settings.outputFolder
        tryMakeDir(outputFolder)
        # salvando jsonAnalisado, na pasta jsons
        tryMakeDir(outputFolder / 'json')




        # salvando arquivo scriptLattesDiff.js
        # savalndo todos os ids
        scriptLattesDiff = {
            'idLattes': {}, # todos os idLattes analisados
            'allIdLattes': sorted(jsonAnalisado['idLattes'].keys(),
                key=lambda x: jsonAnalisado['idLattes'][x]['identificacao']['nome_inicial']),
            'datasProcessamento': jsonAnalisado['datasProcessamento'],
            'nomeDoGrupo': jsonAnalisado['nomeDoGrupo']
        }
        JsonToJs.write(str(outputFolder / 'json' / 'scriptLattesDiff.js'), 'scriptLattesDiff', scriptLattesDiff)




        # salvando cada idLattes
        tryMakeDir(str(outputFolder / 'json' / 'idLattes'))
        for idLattes in jsonAnalisado['idLattes']:


            # salva no arquivo
            JsonToJs.write(
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
        copiarPastas = ['html', 'js', 'css']
        for pasta in copiarPastas:


            src  = str(Misc.scriptPath / pasta)
            dest = str(outputFolder / pasta)
            if os.path.exists(dest):
                shutil.rmtree(dest)



            shutil.copytree(src, dest)





        # move o arquivo redirect para a raíz da pasta output
        shutil.move(
            str(outputFolder / 'html' / 'redirect.htm'),
            str(outputFolder / 'scriptLattesDiff.htm')
        )









import shutil
import os
import glob
from py.ConfigFile import ConfigFile
from py.Settings import Settings
from py.misc import *
from py.List import List
from py.Debug import *