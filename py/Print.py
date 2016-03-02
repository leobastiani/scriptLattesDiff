#!python3
# coding=utf-8


import colorama
import sys

class Print:

    # a quantidade de caracteres da última msg
    tamUltimaMsg = 0




    @staticmethod

    def back(x):
        '''Imprime uma msg na tela e volta o cursor
        para que a próxima mensagem que impressa, seja por cima da atual'''

        # se o tamanho da nova msg é menor do que a última
        tam = len(x)
        if tam < Print.tamUltimaMsg:
            # imprime espaços para prencheer o console
            x = Print.compensar(x, tam)

        Print.tamUltimaMsg = len(x)
        print(x, end='\r')


    def endBack():
        '''Função que você chama assim que
        acaba de usar a função Print.back'''
        print()


    def procentagem(concluido, total, casas=2):
        '''Deve retornar uma porcentagem do concluido em comparação com o total'''
        result = round(concluido / total * 100, casas)
        return str(result)


    def compensar(x, lenX=None):
        '''Compensa com espaços desde o último x impresso'''
        return x+ (' ' * (Print.tamUltimaMsg - lenX))


    def Print(x):
        tam = len(x)
        # se eu imprimi menos caracteres do que o último print
        # vou imprimir espaços para compensar
        x = Print.compensar(x, tam)
        Print.tamUltimaMsg = tam
        print(x)


    def test():
        '''Testa Print.back'''
        Print.back('Testando 1s')
        Print.back('Testando 2')
        Print.back('Testando 3')
        Print.endBack()

        # agora imprime, volta e imprime certo
        import time
        Print.back('ASD')
        Print.Print('A')
        # neste ponto, como eu apaguei o ASD
        # deve estar só o A
        time.sleep(1)


        Print.back('AS')
        Print.endBack()


    def erro(*args):
        '''Imprime uma msg de erro, assim como o print, só que em vermelho'''
        sys.stdout.write(colorama.Fore.RED)
        print(*args)
        sys.stdout.write(colorama.Fore.RESET)


    def success(*args):
        '''Mesmo que print, só que em verde'''
        sys.stdout.write(colorama.Fore.GREEN)
        print(*args)
        sys.stdout.write(colorama.Fore.RESET)


    def warning(*args):
        '''Mesmo que print, só que em amarelo'''
        sys.stdout.write(colorama.Fore.YELLOW)
        print(*args)
        sys.stdout.write(colorama.Fore.RESET)

    def cyan(*args):
        '''Mesmo que print, só que em cyan'''
        sys.stdout.write(colorama.Fore.CYAN)
        print(*args)
        sys.stdout.write(colorama.Fore.RESET)


if __name__ == '__main__':
    Print.test()