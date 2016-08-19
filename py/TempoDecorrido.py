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
import time


class TempoDecorrido:
    '''Nessa classe, assim que fazemos um init, ela
    recebe o tempo atual e seus métodos retornam o tempo
    decorrido a partir desse início'''

    # vou setá-lo com o tempoAtual
    # no init
    comecoTime = None


    def __init__(self):
        # preciso apenas definir o começo
        self.comecoTime = TempoDecorrido.tempoAtual()




    def getSeconds(self):
        '''obtem o tempo decorrido em segundos como float'''
        return TempoDecorrido.tempoAtual() - self.comecoTime

    def getFormatted(self):
        '''retorna uma string do tipo "120.12", como se tivesse passado 120 segundos mais 12ms'''
        return str(round(TempoDecorrido.tempoAtual() - self.comecoTime, 2))


    @staticmethod
    def tempoAtual():
        # retorna o tempo atual em segundos
        return time.time()