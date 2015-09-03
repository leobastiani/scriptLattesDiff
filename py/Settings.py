#!python3
# coding=utf-8

import sys
from pathlib import Path
from py.misc import *



# todas as configurações do programa
class Settings:

    outputFolder = Path(sys.argv[0]).parents[0] # deve ser um objeto de Path
    configFilesGlob = []  # arquivos de configuração que serão analisados pelo script
    
    analisarSimilares = True



    @classmethod
    def setSettingsByArgs(cls, args):
        '''define as configurações com base nos argumentos'''



        def nextArg(i, args):
            '''Função que busca o próximo argumento e trata o erro caso ele não exista'''
            try:
                return args[i+1]
            except:
                print('Erro após a leitura do parâmetro "%s"' % args[i])
                sys.exit(0)



        i = 1 # pula o primeiro que é o nome do arquivo
        while i < len(args):
            arg = args[i]


            if arg == '--help':
                print('Comando help:')
                sys.exit(0)




            elif arg == '--output-folder' or arg == '-o':
                cls.outputFolder = Path(nextArg(i, args))
                i += 1





            elif arg == '--not-similars':
                Settings.analisarSimilares = False

                



            # insira mais comandos por parametro acima
            elif arg[0:1] == '-': # comando inválido
                print('Comando "%s" inválido' % arg)
                sys.exit(0)



            # comando por default
            else:
                # todos os arquivos que serão analisados passa por aqui
                cls.configFilesGlob.append(arg)



            i+=1