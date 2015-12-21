#!python3
# coding=utf-8

import sys
from pathlib import Path
from py.misc import *



# todas as configurações do programa
class Settings:

    outputFolder = Path(sys.argv[0]).parents[0] # deve ser um objeto de Path
    configFilesGlob = []  # arquivos de configuração que serão analisados pelo script
    
    # diz se vamos usar levensthein para analisar strings similares
    analisarSimilares = True

    # se eu devo criar um novo
    # pego o mais recente e crio com base nele
    criarNovoSnapshot = False

    # é a porcentagem para que duas strings
    # sejam consideradas semelhantes
    porcentagemRatioSimilar = 0.8


    @staticmethod
    def setSettingsByArgs(args):
        '''define as configurações com base nos argumentos
        aqueles parametros passados na linha de comando'''

        def nextArg(args):
            if len(args) == 0:
                print('Foi esperado um argumento, mas não foi encontrado.')
                sys.exit(0)
            return args.pop()



        def isThisCommand(arg, *commands):
            '''Retorna se o argumento é um comando válido ou não
                Exemplo:
                    arg = --help
                    commands = [help, h]
                    retorna True'''
            prefixes = ('-', '--', '/')
            for command in commands:
                for prefix in prefixes:
                    if arg == prefix+command:
                        # se '--help' == '--'+'help'
                        return True
            return False



        def isCommand(arg):
            '''Retorna True se o arg for desse tipo:
                --arg
                -arg
                /arg
            '''
            # primeiro caracter da string arg
            firstChar = arg[0:1]
            if firstChar == '-' or firstChar == '/':
                return True
            return False


        def deveSer(arg, tipo):
            '''passe um tipo e verifique se o arg é desse tipo
                Exemplo:
                    arg = '123'
                    tipo = int
                    retorna 123'''

            def onErro(arg, msg):
                print('Erro ao tratar o argumento: "%s"' % arg)
                print(msg)
                sys.exit(0)

            if tipo == str:
                # vou sempre passar uma string
                return arg

            if tipo == int:
                result = None
                try:
                    result = int(arg)
                except:
                    onErro(arg, 'Foi esperado um inteiro.')
                return result

            if tipo == float:
                result = None
                try:
                    result = float(arg)
                except:
                    onErro(arg, 'Foi esperado um número decimal.')
                return result


        # vamos usar um pilha para tratar os parametros
        # exemplo de args
        # ['scriptLattesDiff.py', '*.config', '-o', 'output', '--not-similar']
        # gera esta linha de comando:
        # scriptLattesDiff *.config -o output --not-similar
        args.reverse()
        # remove o primeiro que é sempre scriptLattesDiff
        args.pop()

        while args:
            arg = nextArg(args)


            if isThisCommand(arg, 'help', 'h'):
                print('Comando help:')
                sys.exit(0)




            elif isThisCommand(arg, 'output-folder', 'o'):
                novoCaminho = deveSer(nextArg(args), str)
                print('Novo caminho para a saída:', novoCaminho)
                Settings.outputFolder = Path(novoCaminho)




            elif isThisCommand(arg, 'nao-analisar-similares'):
                print('Não vou analisar as Strings similares.')
                Settings.analisarSimilares = False



            elif isThisCommand(arg, 'novo-snap'):
                print('Novo snapshot a caminho!')
                Settings.criarNovoSnapshot = True


            elif isThisCommand(arg, 'porcentagem-similar'):
                novaPorcentagem = deveSer(nextArg(args), float)
                print('Nova porcentagem para similares: %g%%' % novaPorcentagem)
                Settings.porcentagemRatioSimilar = novaPorcentagem / 100


            # insira mais comandos por parametro acima
            elif isCommand(arg): # comando inválido
                print('Comando "%s" inválido' % arg)
                sys.exit(0)



            # comando por default
            else:
                # todos os arquivos que serão analisados passa por aqui
                Settings.configFilesGlob.append(arg)
