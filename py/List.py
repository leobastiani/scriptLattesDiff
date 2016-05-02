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
        '''
        x e y são pesquisadores
        retorna das listas X e Y
        é um dicionário com '+', '-' e '~'
        o que foi acrescido, o que foi retirado e o que foi alterado
        '''
        result = {
            # o que foi acrescido em y
            '+': [],

            # o que foi removido em y
            '-': [],

            # ~ pode não estar habilitado nas configurações
            # por isso, não está aqui
        }




        for child in x:
            if not List.has(y, child):
                result['-'].append(child)


        for child in y:
            if not List.has(x, child):
                result['+'].append(child)

        if not x or not y:
            # se x ou y está vazios, não tem mais o que comparar
            return result
            

        if not List.isListOfDict(x) or not List.isListOfDict(y):
            # se os elementos de x ou y não forem dicionários
            # não preciso analisar os similares
            # posso retornar já
            return result


        # analisando os elementos que foram adicionados e subtraido
        if Settings.analisarSimilares:
            # se está abilitado nas configurações
            # se está abilitado nas configurações
            result['~'] = List.removeSimilares(result['-'], result['+'])


        return result




    def isListOfDict(x):
        '''testa se x é uma lista de dicionários, testando o primeiro elemento
        se a lista estiver vazia, retorna False'''
        if not x:
            # lista vazia
            return False


        if isinstance(x[0], dict):
            return True

        return False



    def isContida(listaGrande, listaPequena):
        '''diz se a lista pequena está contida em lista grande'''
        for elemPeq in listaPequena:
            if elemPeq not in listaGrande:
                return False

        # todos os elementos de listaPequena estão em listaGrande
        return True



    def removeSimilares(x, y):
        '''remove os elementos similares em x e y, e retorna uma lista com os elementos removidos de y
        é de y porque presumi-se que os elementos em y são mais novos do que em x e se eles são similares, vamos supor que o
        y é mais atualizado
        
        o retorno é da seguinte forma: {
            elemAntigo,
            elemNovo,
            similaridade
        }
        '''

        result = []
        # permutando os elementos
        i = len(x) - 1
        while i >= 0:
            j = len(y) - 1
            while j >= 0:

                # isSimilar ou vale {} ou vale algo como
                # {'descricao': 0.9},
                # portanto, vamos associar o resultado em '~'
                isSimilar = Dict.similar(x[i], y[j])
                if isSimilar:
                    elemSimilar = [
                        # primeiro valor é o que estava em X
                        # ou seja, o mais antigo
                        x[i],

                        # o segundo valor é o que estava em Y
                        # ou seja, o mais novo
                        y[j],

                        # o terceiro valor
                        # é o campo que foi alterado
                        # como: {'descricao': 0.9}
                        isSimilar
                    ]
                    result.append(elemSimilar)

                    # elimina do vetor acrescido e removido
                    del x[i]
                    del y[j]
                    j -= 1
                    # não dou i -= 1 pq já vai acontecer dps do break
                    break

                j -= 1
            i -= 1



        return result