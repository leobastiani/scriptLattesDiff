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


import colorama
import os
import sys

class Print:

    # a quantidade de caracteres da última msg
    tamUltimaMsg = 0




    @staticmethod

    def back(x):
        '''Imprime uma msg na tela e volta o cursor
        para que a próxima mensagem que impressa, seja por cima da atual'''

        # se o tamanho da nova msg é menor do que a última
        tam = len(x)
        if tam < Print.tamUltimaMsg:
            # imprime espaços para prencheer o console
            x = Print.compensar(x, tam)

        Print.tamUltimaMsg = len(x)
        print(x, end='\r')


    def endBack():
        '''Função que você chama assim que
        acaba de usar a função Print.back'''
        print()


    def procentagem(concluido, total, casas=2):
        '''Deve retornar uma porcentagem do concluido em comparação com o total'''
        result = round(concluido / total * 100, casas)
        return str(result)


    def compensar(x, lenX=None):
        '''Compensa com espaços desde o último x impresso'''
        return x+ (' ' * (Print.tamUltimaMsg - lenX))


    def Print(x):
        tam = len(x)
        # se eu imprimi menos caracteres do que o último print
        # vou imprimir espaços para compensar
        x = Print.compensar(x, tam)
        Print.tamUltimaMsg = tam
        print(x)


    def test():
        '''Testa Print.back'''
        Print.back('Testando 1s')
        Print.back('Testando 2')
        Print.back('Testando 3')
        Print.endBack()

        # agora imprime, volta e imprime certo
        import time
        Print.back('ASD')
        Print.Print('A')
        # neste ponto, como eu apaguei o ASD
        # deve estar só o A
        time.sleep(1)


        Print.back('AS')
        Print.endBack()


    def erro(*args, **kwargs):
        '''Imprime uma msg de erro, assim como o print, só que em vermelho'''
        sys.stdout.write(colorama.Fore.RED)
        print(*args, **kwargs)
        sys.stdout.write(colorama.Fore.RESET)


    def success(*args, **kwargs):
        '''Mesmo que print, só que em verde'''
        sys.stdout.write(colorama.Fore.GREEN)
        print(*args, **kwargs)
        sys.stdout.write(colorama.Fore.RESET)


    def warning(*args, **kwargs):
        '''Mesmo que print, só que em amarelo'''
        sys.stdout.write(colorama.Fore.YELLOW)
        print(*args, **kwargs)
        sys.stdout.write(colorama.Fore.RESET)

    def cyan(*args, **kwargs):
        '''Mesmo que print, só que em cyan'''
        sys.stdout.write(colorama.Fore.CYAN)
        print(*args, **kwargs)
        sys.stdout.write(colorama.Fore.RESET)


    def clear():
        os.system("cls")


if __name__ == '__main__':
    Print.test()