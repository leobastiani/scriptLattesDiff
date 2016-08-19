#!python3
# coding=utf-8
 ########################################################################
 # ScriptLattesDiff
 # 
 # 
 # Copyright  (C)  2010-2016  Instituto  de  Ciências  Matemáticas  e  de
 #                            Computação - ICMC/USP
 # 
 # 
 # This program is  free software; you can redistribute  it and/or modify
 # it under the  terms of the GNU General Public  License as published by
 # the Free Software Foundation; either  version 2 of the License, or (at
 # your option) any later version.
 # 
 # This program  is distributed in the  hope that it will  be useful, but
 # WITHOUT   ANY  WARRANTY;   without  even   the  implied   warranty  of
 # MERCHANTABILITY  or FITNESS  FOR A  PARTICULAR PURPOSE.   See  the GNU
 # General Public License for more details.
 # 
 # You  should have received  a copy  of the  GNU General  Public License
 # along  with  this  program;  if   not,  write  to  the  Free  Software
 # Foundation,  Inc.,  51  Franklin   Street,  Fifth  Floor,  Boston,  MA
 # 02110-1301, USA.
 # 
 # 
 # EXCEPTION TO THE TERMS AND CONDITIONS OF GNU GENERAL PUBLIC LICENSE
 # 
 # The  LICENSE  file may  contain  an  additional  clause as  a  special
 # exception  to the  terms  and  conditions of  the  GNU General  Public
 # License. This  clause, if  present, gives you  the permission  to link
 # this  program with  certain third-part  software and  to obtain,  as a
 # result, a  work based  on this program  that can be  distributed using
 # other license than the GNU General Public License.  If you modify this
 # program, you may extend this exception to your version of the program,
 # but you  are not obligated  to do so.   If you do  not wish to  do so,
 # delete this exception statement from your version.
 # 
 ########################################################################
import sys



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
        if not Debug.DEBUG:
            return ;
            
        Debug.strSimilares += [(x, y, ratio)]



    def saveFiles():

        if not Debug.DEBUG:
            # não estou no modo de depuração
            return ;


        print('Gerando arquivos de depuração.')

        # salva o os similares no arquivo de debug
        similarPath = str(Misc.scriptPath / 'debug' / 'json' / 'similares.json')
        Json.writeToJs(similarPath, 'Debug[\'similares\']', {
            'strSimilares': Debug.strSimilares,
            'porcentagemRatioSimilar': Settings.porcentagemRatioSimilar
        })



        # copia a pasta debug para a pasta de saída
        if Settings.outputFolder != Misc.scriptPath:
            shutil.copytree(
                str(Misc.scriptPath / 'debug'),
                str(Settings.outputFolder / 'debug')
            )





from py.misc import *
from py.Json import Json
from py.Settings import Settings