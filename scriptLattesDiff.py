#!python3
# coding=utf-8




# analisa as dependencias antes de começar
import py.Dependencies





import sys
from py.misc import *
from py.Settings import Settings
from py.ScriptLattesDiff import ScriptLattesDiff
from py.Print import Print
import colorama



def main():
    scriptLattesDiff = ScriptLattesDiff()





    scriptLattesDiff.analisarXml()





    # se foi carregado apenas um arquivo, não há como fazer análises temporais com ele
    if len(scriptLattesDiff.configFiles) < 2:
        # Não há arquivos de configuração suficientes para comparar.
        Print.erro('Não há arquivos de configuração suficientes para comparar')
        sys.exit(0)




    # teste de pesquisadores no grupo
    if not scriptLattesDiff.hasSameIdLattes():
        Print.erro('Os arquivos XMLs não possuem os mesmos pesquisadores.')
        sys.exit(0)







    # cria as classes com os arquivos de configuração
    jsonAnalisado = scriptLattesDiff.analisarJsons()
    scriptLattesDiff.saveJsonAnalisado(jsonAnalisado)






    # copia os arquivos para o diretório de saída
    ScriptLattesDiff.copyFilesToOutput()





if __name__ == '__main__':
    # inicializa o colorama
    colorama.init()

    section('Apresentação do scriptLattesDiff')


    # analisando os parâmetros
    if len(sys.argv) < 2:
        print('Messagem de apenas um argumento')
        sys.exit(0)




    Settings.setSettingsByArgs(sys.argv)
    main()
