#!python3
# coding=utf-8



import os
from py.misc import *

try:
    # todas as dependencias vão aqui
    # se o usuário não possuir alguma, sobe uma exceção
    import nltk







except ImportError as e:



    print('As dependecias para o scriptLattesDiff não foram encontradas.')



    print('\nComando sugerido:')
    pyCmd = Misc.getPyCmd()
    command = pyCmd+' -m pip install -r requirements.txt'
    print('\t'+command)


    print('\nGostaria de instalá-las? (y/n)')



    aws = input()
    if aws != 'y':
        exit()
    print()
    print(command)

    # instalando as dependecias
    os.system(command)



    print()
    print('Por favor, rode o scriptLattesDiff novamente.')
    exit()