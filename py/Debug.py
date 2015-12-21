#!python3
# coding=utf-8


import sys
from py.misc import *
from py.Json import Json
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

        # só vou adicionar os elementos que se parecem
        # os que não se parecem não estarão na lista
        # pois a lista chega a mais de 30MB
        ratioParecido = list(elems[2].values())[0]
        if ratioParecido == 1:
            # não vou debugar strings iguais
            return ;


        if not ratioParecido > Settings.porcentagemRatioSimilar:
            # se elas não são parecidas
            return ;

        # se for parecido, adiciona
        Debug.elementosSimilares.append(list(elems))




    def saveFiles():
        if not Debug.isEnabled():
            return ;


        print('Gerando arquivos de depuração.')




        # salva o os similares no arquivo de debug
        similarPath = str(Misc.scriptPath / 'debug' / 'json' / 'similares.json')
        Json.writeToJs(similarPath, 'Debug[\'similares\']', Debug.elementosSimilares)



        # copia a pasta debug para a pasta de saída
        if Settings.outputFolder != Misc.scriptPath:
            shutil.copytree(
                str(Misc.scriptPath / 'debug'),
                str(Settings.outputFolder / 'debug')
            )