#!python3
# coding=utf-8


import sys
from py.misc import *
from py.Json import Json
from py.Settings import Settings
import shutil




def debug(*args):
    '''funciona como print, mas só é executada se sys.flags.debug == 1'''
    if not sys.flags.debug:
        return ;
    print(*args)







class Debug:



    @staticmethod
    def isEnabled():
        return sys.flags.debug