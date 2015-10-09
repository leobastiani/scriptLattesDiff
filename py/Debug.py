#!python3
# coding=utf-8


import sys
from py.misc import *
from py.JsonToJs import JsonToJs
from py.Settings import Settings
import shutil




def debug(*args):
    '''funciona como print, mas só é executada se sys.flags.debug == 1'''
    if not sys.flags.debug:
        return ;
    print(*args)







class Debug:





    # variavel static
    # me diz quais foram os elementos similares para depurar no final do processo
    elementosSimilares = []






    @staticmethod




    def isEnabled():
        return sys.flags.debug





    def addSimilar(*elems):
        if not Debug.isEnabled():
            return ;


        Debug.elementosSimilares.append(list(elems))




    def saveFiles():
        if not Debug.isEnabled():
            return ;


        print('Gerando arquivos de depuração.')




        # salva o os similares no arquivo de debug
        similarPath = str(Misc.scriptPath / 'debug' / 'json' / 'similares.json')
        JsonToJs.write(similarPath, 'Debug[\'similares\']', Debug.elementosSimilares)



        # copia a pasta debug para a pasta de saída
        if Settings.outputFolder != Misc.scriptPath:
            shutil.copytree(
                str(Misc.scriptPath / 'debug'),
                str(Settings.outputFolder / 'debug')
            )