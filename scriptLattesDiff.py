#!python3
# coding=utf-8




# analisa as dependencias antes de começar
import py.Dependencies





import sys
from py.misc import *
from py.Settings import Settings
from py.ScriptLattesDiff import ScriptLattesDiff
import colorama






if __name__ == '__main__':
    # inicializa o colorama
    colorama.init()

    section('ScriptLattesDiff', beg='')


    # analisando os parâmetros
    if len(sys.argv) < 2:
        Settings.usage()
        sys.exit(0)




    Settings.setSettingsByArgs(sys.argv)
    try:
        ScriptLattesDiff.main()
    except KeyboardInterrupt:
        pass