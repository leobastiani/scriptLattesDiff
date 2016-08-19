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


import os
import sys
import re
from pathlib import Path
import colorama




def section(*args, beg='\n'):
    '''Cria um texto chamativo que divide seções no console'''

    tamMaiorStr = 0
    for arg in args:
        tamMaiorStr = max(tamMaiorStr, len(str(arg)))

    strIgual = '=' * tamMaiorStr
    print(beg, end='')
    print(colorama.Fore.CYAN+'/* '+strIgual+'\n   ', end='')
    print('\n   '.join(str(x) for x in args))
    print('   '+strIgual+' */'+colorama.Fore.RESET)






class Misc:


    # retorna um objeto de Path do script em execução
    scriptPath = Path(sys.argv[0]).parents[0]

    pyCmd = None



    @staticmethod

    def isWindows():
        return os.name == 'nt'


    def getPyCmd():
        '''retorna py -3 se for windows e python3 se for linux'''
        if Misc.pyCmd:
            return Misc.pyCmd # já sabe ql o valor para retornar

        if Misc.isWindows():
            Misc.pyCmd = 'py -3'
        else:
            Misc.pyCmd = 'python3'

        return Misc.pyCmd



    def respostaYN(errorMsg='Por favor, digite y ou n.'):
        '''Exige que você responda y ou n pela entrada do teclado'''
        if Settings.suprimirYN:
            # devo suprimir, ou seja, retornar yes direto
            return True

        while True:
            try:
                aws = input().lower()
            except:
                exit(0)

            if aws == 'y':
                return True
            elif aws == 'n':
                return False
            else:
                print(errorMsg)


    def strToList(x):
        '''pega uma string x como "asd, 123, dsa" e retorna
        ['asd', '123', 'dsa']'''
        return re.split(r'\s*,\s*', x)



    def strExecutarScriptLattes(pathConfigFile):
        '''obtenha um comando para ser executado pelo terminal
        para o novo arquivo. Por exemplo:
        "scriptLattes d:/facul/ic/snaps/icmc/20160302/ICMC.config"'''
        if Misc.isWindows():
            return 'scriptLattes '+str(pathConfigFile)
        # não estou no windows
        return 'bash scriptLattes.sh '+str(pathConfigFile)




from py.Settings import Settings