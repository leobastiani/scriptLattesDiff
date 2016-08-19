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


import nltk
from py.misc import *
from py.Settings import Settings
from py.Debug import Debug



class Str:



    '''Funções relacionadas a String uteis no scriptLattesDiff'''



    def similar(x, y):
        '''calcula Levensthein de X e Y em porcentagem em relação a X
        devolve o ratio: um número entre 0 e 1 inclusive'''
        if not Settings.analisarSimilares:
            # não quero analisar os similares
            return x == y




        # se um deles está vazio
        if x == '' or y == '':
            # se os dois tão vazios, retorna 1
            # se um tá vazio e o outro não, retorna 0
            return 1 if x == y else 0




        # x e y são cortados até a qntidade máxima de caracteres
        x = x[0:Settings.maxLetrasSimilares]
        y = y[0:Settings.maxLetrasSimilares]


        # calcula o levenshtein
        ratio = Str.ratio(x, y)
        if ratio > Settings.porcentagemRatioSimilar:
            return ratio



        return 0





    def ratio(x, y):
        '''calcula em porcentagem o quanto a string X é parecida com a Y'''
        sumLen = len(x) + len(y)
        result = ( sumLen - nltk.metrics.distance.edit_distance(x.lower(), y.lower()) ) / sumLen

        # se eu quero depurar, vamos analisar todos os similares
        Debug.addRatio(x, y, result)

        return result