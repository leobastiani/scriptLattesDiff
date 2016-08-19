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


try:
    # todas as dependencias vão aqui
    # se o usuário não possuir alguma, sobe uma exceção
    import nltk
    import colorama






except:
    def getPyCmd():
        '''retorna py -3 se for windows e python3 se for linux'''
        if os.name == 'nt':
            return 'py -3'
        elif os.name == 'posix':
            return 'python3'
        else:
            raise OSError("Não foi possível obter o comando de Python para esse sistema")

    def respostaYN(errorMsg='Por favor, digite y ou n.'):
        '''Exige que você responda y ou n pela entrada do teclado'''
        while True:
            try:
                aws = input().lower()
            except:
                exit(0)

            if aws == 'y':
                return 'y'
            elif aws == 'n':
                return 'n'
            else:
                print(errorMsg)


    print('As dependecias para o scriptLattesDiff não foram encontradas.')



    print('\nComando sugerido:')
    pyCmd = getPyCmd()
    command = pyCmd+' -m pip install -r requirements.txt'
    print('\t'+command)


    print('\nGostaria de instalá-las? (y/n)')
    aws = respostaYN()
    if aws == 'n':
        sys.exit(0)
    print()
    

    # instalando as dependecias
    print(command)
    os.system(command)



    print()
    print('Por favor, rode o scriptLattesDiff novamente.')
    exit()