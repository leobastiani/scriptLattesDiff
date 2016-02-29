#!python3
# coding=utf-8

import os
import sys
import re
from pathlib import Path
import colorama



def section(*args):
    '''Cria um texto chamativo que divide seções no console'''

    tamMaiorStr = 0
    for arg in args:
        tamMaiorStr = max(tamMaiorStr, len(str(arg)))

    strIgual = '=' * tamMaiorStr

    print(colorama.Fore.CYAN+'\n/* '+strIgual+'\n   ', end='')
    print('\n   '.join(str(x) for x in args))
    print('   '+strIgual+' */'+colorama.Fore.RESET)






class Misc:


    # retorna um objeto de Path do script em execução
    scriptPath = Path(sys.argv[0]).parents[0]

    pyCmd = None



    @staticmethod
    def getPyCmd():
        '''retorna py -3 se for windows e python3 se for linux'''
        if Misc.pyCmd:
            return Misc.pyCmd # já sabe ql o valor para retornar

        if os.name == 'nt':
            Misc.pyCmd = 'py -3'
        elif os.name == 'posix':
            Misc.pyCmd = 'python3'
        else:
            raise OSError("Não foi possível obter o comando de Python para esse sistema")

        return Misc.pyCmd



    def respostaYN(errorMsg='Por favor, digite y ou n.'):
        '''Exige que você responda y ou n pela entrada do teclado'''
        while True:
            try:
                aws = input()
            except:
                exit(0)

            if aws == 'y':
                return 'y'
            elif aws == 'n':
                return 'n'
            else:
                print(errorMsg)


    def strToList(x):
        '''pega uma string x como "asd, 123, dsa" e retorna
        ['asd', '123', 'dsa']'''
        return re.findall(r'(\w+)', x)