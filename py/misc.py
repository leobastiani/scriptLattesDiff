#!python3
# coding=utf-8

import os
import sys
from pathlib import Path



def strIsFloat(str):
    return str.replace('.', '', 1).isdigit()




def section(*args):
    '''Cria um texto chamativo que divide seções no console'''
    print('\n/* =============================\n   ', end='')
    print('\n   '.join(str(x) for x in args))
    print('   ============================= */')






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