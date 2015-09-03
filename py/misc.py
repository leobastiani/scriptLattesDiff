#!python3
# coding=utf-8

import unicodedata
import sys
from pathlib import Path



def strip_accents(s):
    '''Remove todos os acentos da string'''
    return ''.join(c for c in unicodedata.normalize('NFD', s)if unicodedata.category(c) != 'Mn')






def strIsFloat(str):
    return str.replace('.', '', 1).isdigit()








def isEmpty(obj):
    return not obj






def section(*args):
    '''Cria um texto chamativo que divide seções no console'''
    print('\n/* =============================\n   ', end='')
    print('\n   '.join(str(x) for x in args))
    print('   ============================= */')






class Misc:


    # retorna um objeto de Path do script em execução
    scriptPath = Path(sys.argv[0]).parents[0]