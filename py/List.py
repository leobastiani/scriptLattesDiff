#!python3
# coding=utf-8


from py.Dict import Dict
from py.Settings import Settings
from py.misc import *




class List:


    '''funções relacionadas as Listas usadas pelo scriptLattesDiff'''


    @staticmethod

    def has(x, value):
        '''X é uma lista
        retorna True se X possui o filho com o dicionário value especificado'''
        for elem in x:
            if Dict.equals(elem, value):
                return True
        return False





    def differences(x, y):
        '''retorna das listas X e Y
        é uma tupla de 2 elementos
        o primeiro é o que foi acrescido em Y que não havia em X
        o segundo é o que foi subtraido de X, não há em Y, mas há em X'''



        result = {
            'acrescido': [],
            'subtraido': []
        }




        for child in x:
            if not List.has(y, child):
                result['subtraido'].append(child)


        for child in y:
            if not List.has(x, child):
                result['acrescido'].append(child)




        # analisando os elementos que foram adicionados e subtraido
        if Settings.analisarSimilares:
            # se está abilitado nas configurações





            # permutando os elementos
            i = len(result['acrescido']) - 1
            while i >= 0:
                j = len(result['subtraido']) - 1
                while j >= 0:





                    if Dict.similar(result['acrescido'][i], result['subtraido'][j]):
                        del result['acrescido'][i]
                        del result['subtraido'][j]
                        j -= 1
                        # não dou i -= 1 pq já vai acontecer dps do break
                        break






                    j -= 1
                i -= 1






        return result['acrescido'], result['subtraido']