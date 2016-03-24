#!python3
# coding=utf-8

import sys
from py.Print import Print
from pathlib import Path
from py.misc import *



# todas as configurações do programa
class Settings:

    outputFolder = Path(sys.argv[0]).parents[0] # deve ser um objeto de Path
    configFilesGlob = [] # arquivos de configuração que serão analisados pelo script
    
    # diz se vamos usar levensthein para analisar strings similares
    analisarSimilares = True

    # se eu devo criar um novo
    # pego o mais recente e crio com base nele
    # criarNovoSnapshot como True vai criar o novo snap
    # na pasta padrão dele
    # que é uma pasta anterior a pasta do arquivo
    # com o nome YYMMDD: ano, mês e dia
    # se criarNovoSnapshot for uma string
    # então o arquivo destino se encaminhará para essa pasta
    criarNovoSnapshot = False

    # é a porcentagem para que duas strings
    # sejam consideradas semelhantes
    porcentagemRatioSimilar = 0.8

    # as informações do primeiro snap não são necessárias
    # por isso, pode inclui-las no json ou não
    incluirPrimeiroSnap = False

    # quantidade máxima de pesquisadores para por no resultado final
    # bom para testes
    maxPesquisadores = float('inf')

    # lista de pesquisadores com os IDs
    # que eu devo pesquisar
    # por padrão é None
    # mas se for fornecido pelo usuário
    # deve ser uma lista assim [12334, 144623, 16354123, ...]
    pesquisadoresList = None

    # este argumento não faz necessida da pergunta de Y/N, supondo que a pessoa
    # quis deixar como Y
    suprimirYN = False

    # Versão do scriptLattes que gerou aqueles arquivos json
    # deve ser string
    versao = '1'


    @staticmethod
    def usage():
        '''imprime o comando help ou os exemplos de como usar'''
        def printCommand(*args):
            Print.cyan(*args)

        print('Insira os arquivos .config nos parâmetros sem nenhum caracter especial.')
        print('  Por exemplo: \n  ./Data1/*.config ./Data2./*.config\n')
        print('Utilize wildcards para economizar esforços.')
        print('  Por exemplo:')
        print('  Essa linha de comando seria capaz de varrer essa estrutura com facilidade:')
        print('  ./')
        print('    Datas/')
        print('      Data1/')
        print('        grupo1.config\n')
        print('      Data2/')
        print('        grupo1.config\n')
        print('  Comando: ./Datas/**/*.config\n')
        print('Os comandos começam por "--", "-" ou "/", por exemplo:')
        print('  --help, -help ou /help\n')
        print('Os seguintes comandos estão disponíveis para complementar as funcionalidades do scriptLattesDiff:')
        Print.cyan('-output-folder, -o:')
        print('  Define o novo caminho para a saída dos arquivos gerados.')
        print('  Por exemplo: -o "PastaDeSaida"\n')
        Print.cyan('-nao-analisar-similares, -ns:')
        print('  O scriptLattesDiff não analisará frases semelhantes.')
        print('  Com esse comando o scriptLattesDiff se torna muito mais rápido.\n')
        Print.cyan('-novo-snap, -novo-arquivo, -na:')
        print('  Cria um novo arquivo .config para que o scriptLattes possa interpretá-lo.\n')
        Print.cyan('-porcentagem-similar, -ps:')
        print('  Define a nova porcentagem de critério para frases parecidas, sendo que 0 significa que todas as frases serão consideradas semelhantes e 100 significa que apenas frases idênticas são consideradas semelhantes.')
        print('  Por exemplo: -ps 88\n')
        Print.cyan('-incluir-primeiro-snap, -ip:')
        print('  Permite ao scriptLattesDiff inserir os dados do primeiro arquivo XML nos arquivos finais.\n')
        Print.cyan('-pesquisadores, -p:')
        print('  Limita o número de pesquisadores que o scriptLattesDiff irá pesquisar.')
        print('  Insira logo em sequência o número correspondente ao currículo desses pesquisadores.')
        print('  Por exemplo: -p "123, 456, 789"\n')
        Print.cyan('-max-pesquisadores, -max:')
        print('  Defina o número máximo de pesquisadores que serão comparados.')
        print('  Por exemplo: -max 5\n')
        print('Site do projeto: http://github.com/leobastiani/scriptLattesDiff')


    def setSettingsByArgs(args):
        '''define as configurações com base nos argumentos
        aqueles parametros passados na linha de comando'''

        def novoArg(args):
            '''obtem um novo argumento, removendo-o da pilha de argumentos'''
            if len(args) == 0:
                return ''
            return args.pop()


        def proxArg(args):
            '''obtem o novo argumento, sem removê-lo da pilha'''
            if len(args) == 0:
                return ''
            return args[0]



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


        def deveSer(arg, tipo, saiSeNaoFor=True):
            '''passe um tipo e verifique se o arg é desse tipo
                Exemplo:
                    arg = '123'
                    tipo = int
                    retorna 123
                fecha o programa'''

            def onErro(arg, msg):
                if not saiSeNaoFor:
                    # se eu não quero sair do programa
                    # apenas quis testar se o ele é
                    return ;

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
            arg = novoArg(args).lower()


            if isThisCommand(arg, 'help', 'h', '?'):
                Settings.usage()
                sys.exit(0)


            elif isThisCommand(arg, 'output-folder', 'o'):
                novoCaminho = deveSer(novoArg(args), str)
                print('Novo caminho para a saída:', novoCaminho)
                Settings.outputFolder = Path(novoCaminho)


            elif isThisCommand(arg, 'nao-analisar-similares', 'ns'):
                Print.warning('Configuração para não analisar as os campos similares.')
                Settings.analisarSimilares = False



            elif isThisCommand(arg, 'novo-snap', 'novo-arquivo', 'na'):
                Print.warning('Novo snapshot a caminho!')
                # eu posso digitar na linha de comando este exemplo:
                # --novo-snap "D:\Aqui\"
                # e o novo snap vai para a pasta descrita
                pathDest = proxArg(args)
                # o and pathDest qr dizer se ele tem algum conteúdo
                if not isCommand(pathDest) and pathDest:
                    # verifico antes se o diretório existe
                    pathDest = Path(pathDest)
                    if not pathDest.is_dir():
                        # se o diretório inserido não existe
                        # ou não é uma pasta
                        # devo sair
                        Print.erro('O destino "'+str(pathDest)+'" não corresponde a uma pasta.')
                        sys.exit(0)
                    # devo pegar o resolvido:
                    Settings.criarNovoSnapshot = pathDest.absolute()

                else:
                    # criarNovoSnapshot como true
                    # qr dizer que ele vai para a pasta padrão de novos snaps
                    Settings.criarNovoSnapshot = True


            elif isThisCommand(arg, 'porcentagem-similar', 'ps'):
                # porcentagem aqui é um número de 0 a 100
                novaPorcentagem = deveSer(novoArg(args), float)
                Print.warning('Nova porcentagem para similares: %g%%' % novaPorcentagem)
                Settings.porcentagemRatioSimilar = novaPorcentagem / 100


            elif isThisCommand(arg, 'incluir-primeiro-snap', 'ip'):
                Print.warning('Incluindo o primeiro Snap nos arquivos Jsons')
                Settings.incluirPrimeiroSnap = not Settings.incluirPrimeiroSnap


            elif isThisCommand(arg, 'max-pesquisadores', 'max'):
                maxPesquisadores = deveSer(novoArg(args), int)
                Print.warning('Pesquisando no máximo %d pesquisadores.' % maxPesquisadores)
                Settings.maxPesquisadores = maxPesquisadores


            elif isThisCommand(arg, 'pesquisadores', 'p'):
                # pesquisadoresStr é uma string do tipo
                # 123345, 12324536, 123651, 542542656, 135236536
                pesquisadoresStr = deveSer(novoArg(args), str)
                pesquisadoresList = Misc.strToList(pesquisadoresStr)
                Settings.pesquisadoresList = pesquisadoresList
                Print.warning('Analisando os seguintes pesquisadores: "'+', '.join(pesquisadoresList)+'"')


            elif isThisCommand(arg, 'yes', 'y'):
                Settings.suprimirYN = True


            # insira mais comandos por parametro acima
            elif isCommand(arg): # comando inválido
                print('Comando "%s" inválido' % arg)
                sys.exit(0)



            # comando por default
            else:
                # todos os arquivos que serão analisados passa por aqui
                Settings.configFilesGlob.append(arg)
