#!python3
# coding=utf-8


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