#!python3
# coding=utf-8



import os

try:
    import nltk







except ImportError as e:



    print('As dependecias para o scriptLattesDiff não foram encontradas.')



    print('\nComando sugerido:')
    command = 'python3 -m pip install -r requirements.txt'
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