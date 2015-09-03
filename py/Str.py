#!python3
# coding=utf-8


import nltk
from py.misc import *




class Str:



    '''Funções relacionadas a String uteis no scriptLattesDiff'''



    def similar(x, y):
        '''calcula Levensthein de X e Y em porcentagem em relação a X
        devolve o ratio'''





        # se um deles está vazio
        if x == '' or y == '':
            return 1 if x == y else 0




        # deixa que x seja a menor string
        if len(x) > len(y): x, y = y, x
        # y passa a ter o msmo tamanho de x
        y = y[0:len(x)]






        # calcula o levenshtein
        ratio = Str.ratio(x, y)
        if ratio > 0.8:
            return ratio



        return 0





    def ratio(x, y):
        '''calcula em porcentagem o quanto a string X é parecida com a Y'''
        sumLen = len(x) + len(y)
        return ( sumLen - nltk.metrics.distance.edit_distance(x.lower(), y.lower()) ) / sumLen