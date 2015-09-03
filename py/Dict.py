#!python3
# coding=utf-8


# imports no final do arquivo





class Dict:


    """Trata as funções de dicionário do scriptLattesDiff"""


    

    @staticmethod


    def equals(x, y):
        '''retorna True se X e Y forem iguais,
        retorna True se X e Y forem parecidos de acordo com as necessidades do scriptLattesDiff'''


        return x == y



    def similar(x, y):
        '''testa se os elementos são parecidos, ela é muito mais devagar do que a equals
        por isso ela existe e não é chamada no lugar da equals'''


        def _similar(x, y):
            '''função auxiliar e verdadeira'''



            # se as chaves forem diferentes, pode retornar falso
            if x.keys() != y.keys():
                return 0




            # analisa campos importantes, se um deles for parecido, retorna que é similar
            camposImportantes = ['titulo', 'nome', 'descricao']
            for campo in camposImportantes:
                if campo in x:


                    # se eles possuem esse campo, compara se são similares
                    similar = Str.similar(x[campo], y[campo])
                    return similar, {campo: similar}




            # dicionário com o resultado de similar
            similar = {}
            for campo in x.keys():


                # acontece muitos problemas com o campo autor, não vou analisálo
                if campo == 'autores':
                    continue




                # já testei os principais campos
                if campo in camposImportantes:
                    continue





                # se não similares, então houve um erro
                similar[campo] = Str.similar(x[campo], y[campo])
                if not similar[campo]:


                    # se não for similar
                    return 0, similar




            return 1, similar






        ################
        # retorna a função de verdade
        result, similar = _similar(x, y)
        Debug.addSimilar(x, y, similar)
        return result





    def resumir(x):
        '''nesta função, ao invés de mostrar o json, mostra-se a parte mais interessante, que o título ou o nome'''


        maisImportantes = ['titulo', 'nome']
        for i in maisImportantes:
            if i in x:
                return x[i]



        # fecha o programa para tratar esse erro
        print(x)
        raise 'Erro resumir dict'







from py.Str import Str
from py.misc import *
from py.ScriptLattesDiff import ScriptLattesDiff
from py.Debug import Debug
import math