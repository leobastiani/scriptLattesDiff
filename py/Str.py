#!python3
# coding=utf-8


import nltk
from py.misc import *
from py.Settings import Settings
from py.Debug import Debug



class Str:



    '''Funções relacionadas a String uteis no scriptLattesDiff'''



    def similar(x, y):
        '''calcula Levensthein de X e Y em porcentagem em relação a X
        devolve o ratio: um número entre 0 e 1 inclusive'''
        if not Settings.analisarSimilares:
            # não quero analisar os similares
            return x == y




        # se um deles está vazio
        if x == '' or y == '':
            # se os dois tão vazios, retorna 1
            # se um tá vazio e o outro não, retorna 0
            return 1 if x == y else 0




        # deixa que x seja a menor string
        if len(x) > len(y): x, y = y, x
        # y passa a ter o msmo tamanho de x
        lenX = len(x)
        y = y[0:lenX]


        # calcula o levenshtein
        ratio = Str.ratio(x, y)
        if ratio > Settings.porcentagemRatioSimilar:
            return ratio



        return 0





    def ratio(x, y):
        '''calcula em porcentagem o quanto a string X é parecida com a Y'''
        sumLen = len(x) + len(y)
        result = ( sumLen - nltk.metrics.distance.edit_distance(x.lower(), y.lower()) ) / sumLen

        # se eu quero depurar, vamos analisar todos os similares
        if Debug.DEBUG:
            Debug.addRatio(x, y, result)

        return result