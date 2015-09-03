#!python3
# coding=utf-8


import sys
from py.misc import *
from py.JsonToJs import JsonToJs




def debug(*args):
    if not sys.flags.debug:
        return ;
    # resolve o problema da codificação
    args = list(args)
    for i, arg in enumerate(args):
        args[i] = strip_accents(str(arg))
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
