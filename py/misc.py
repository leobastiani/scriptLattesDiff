#!python3
# coding=utf-8

import unicodedata

def strip_accents(s):
    '''Remove todos os acentos da string'''
    return ''.join(c for c in unicodedata.normalize('NFD', s)if unicodedata.category(c) != 'Mn')

def strIsFloat(str):
    return str.replace('.', '', 1).isdigit()

DEBUG = False

def setDebug(x):
    global DEBUG
    DEBUG = x

def debug(*args):
    global DEBUG
    if not DEBUG:
        return ;
    # resolve o problema da codificação
    args = list(args)
    for i, arg in enumerate(args):
        args[i] = strip_accents(str(arg))
    print(*args)

def isDebug():
    global DEBUG
    return DEBUG

def isEmpty(obj):
    return not obj

def section(*args):
    '''Cria um texto chamativo que divide seções no console'''
    print('\n/* =============================\n   ', end='')
    print(*args)
    print('   ============================= */')
