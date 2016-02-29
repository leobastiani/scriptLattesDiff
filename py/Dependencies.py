#!python3
# coding=utf-8



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