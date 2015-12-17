#!python3
# coding=utf-8




# analisa as dependencias antes de começar
import py.Dependencies





import sys
from py.misc import *
from py.Settings import Settings
from py.ScriptLattesDiff import ScriptLattesDiff





# variaveis para depuração
idLattesAdes = '9836776931160228'
idSeiji = '3030047284254233'





def main():


    scriptLattesDiff = ScriptLattesDiff()





    scriptLattesDiff.analisarXml()





    print('Arquivos de configuração encontrados: ')
    for file in scriptLattesDiff.filesPath:
        print(str(file))





    # se foi carregado apenas um arquivo, não há como fazer análises temporais com ele
    if len(scriptLattesDiff.configFiles) < 2:
        # Não há arquivos de configuração suficientes para comparar.
        print('Não há arquivos de configuração suficientes para comparar')
        exit()




    # teste de pesquisadores no grupo
    if not scriptLattesDiff.hasSameIdLattes():
        print('Os arquivos XMLs não possuem os mesmos pesquisadores.')
        exit()







    # cria as classes com os arquivos de configuração
    jsonAnalisado = scriptLattesDiff.analisarJsons()
    scriptLattesDiff.saveJsonAnalisado(jsonAnalisado)






    # copia os arquivos para o diretório de saída
    ScriptLattesDiff.copyFilesToOutput()

    ScriptLattesDiff.onFisnish()





if __name__ == '__main__':

    section('Apresentação do scriptLattesDiff')


    # analisando os parâmetros
    if len(sys.argv) < 2:
        print('Messagem de apenas um argumento')
        sys.exit(0)




    Settings.setSettingsByArgs(sys.argv)
    main()
