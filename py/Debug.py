#!python3
# coding=utf-8


import sys
from py.misc import *
from py.Json import Json



def debug(*args):
    '''funciona como print, mas só é executada se sys.flags.debug == 1'''
    if not sys.flags.debug:
        return ;
    print(*args)







class Debug:

    # variavel que diz se estou no modo Debug
    DEBUG = sys.flags.debug

    # esta varaivel contém todas as comparações de similares que foram
    # feitas, ela deve ser preenchida somente quando estou no debug
    # deve ser da seguinte maneira
    # [ [x, y, ratio] ]
    # é lista de lista
    # por exemplo:
    # [ ['Leonardo', 'lonardo', 0.99], ... ]
    strSimilares = []


    @staticmethod
    def addRatio(x, y, ratio):
        '''adiciona um novo ratio ao strSimilares'''
        Debug.strSimilares += [(x, y, ratio)]



    def saveFiles():

        if not Debug.DEBUG:
            # não estou no modo de depuração
            return ;


        print('Gerando arquivos de depuração.')

        # salva o os similares no arquivo de debug
        similarPath = str(Misc.scriptPath / 'debug' / 'json' / 'similares.json')
        Json.writeToJs(similarPath, 'Debug[\'similares\']', Debug.strSimilares)



        # copia a pasta debug para a pasta de saída
        if Settings.outputFolder != Misc.scriptPath:
            shutil.copytree(
                str(Misc.scriptPath / 'debug'),
                str(Settings.outputFolder / 'debug')
            )