#!python3
# coding=utf-8


# imports no final do arquivo





class Dict:


    '''Trata as funções de dicionário do scriptLattesDiff'''


    

    @staticmethod


    def equals(x, y):
        '''retorna True se X e Y forem iguais,
        retorna True se X e Y forem parecidos de acordo com as necessidades do scriptLattesDiff'''


        return x == y




    def similar(x, y):
        '''testa se os elementos são parecidos, ela é muito mais devagar do que a equals
        por isso ela existe e não é chamada no lugar da equals
        retorna um elemento do tipo:
        {'descricao': 0.9} ou {}'''

        def returnSimilar(x, y, campo):
            '''x e y são strings'''
            # se eles possuem esse campo, compara se são similares
            similar = Str.similar(x, y)
            if not (similar > Settings.porcentagemRatioSimilar):
                # se não for parecido
                return {}

            result = {campo: similar}
            return result


        # analisa campos importantes, se um deles for parecido, retorna que é similar
        camposImportantes = ['titulo', 'nome', 'descricao', 'titulo_trabalho']
        for campo in camposImportantes:
            # se está em X, também está em Y
            if campo not in x:
                continue

            # se os dois estão vazios, não posso concluir com esse algoritmo
            if x[campo] == '' and y[campo] == '':
                # não analiso os dois vazios
                continue

            elif x[campo] == '' or y[campo] == '':
                # um deles está vazio, mas o outro não
                if 'autores' in x:
                    # só faço isso se tiver autores

                    # deixa que o y sempre seja vazio
                    if x[campo] == '':
                        x, y = y, x

                    # novo campo que será utilizado para comparação
                    yCampo = y['autores'][len(x['autores'])+3:len(y['autores'])]

                    if yCampo == '':
                        # provavelmente, os autores mudaram
                        # começo a testar de novo
                        xCampo = x['autores']+x[campo]
                        yCampo = y['autores']
                    else:
                        xCampo = x[campo]

                    camposParaAdicionar = ['natureza', 'nome_evento', 'livro', 'editora', 'paginas', 'ano']
                    for campoParaAdicionar in camposParaAdicionar:
                        if campoParaAdicionar in x:
                            xCampo += x[campoParaAdicionar]
                    
                    return returnSimilar(xCampo, yCampo, campo)

            # caso em que não 
            return returnSimilar(x[campo], y[campo], campo)



        # dicionário com o resultado de similar
        similar = {}
        # aqui vão os campos para não analisarmos
        # costumava ser 'autores', mas eu resolvi deixar vazio
        # deve ser do tipo set
        camposNaoAnalisar = set(['ano'])
        # já testei os camposImportantes e não preciso testar camposNãoAnalisar
        campos = set(x.keys()) - camposNaoAnalisar - set(camposImportantes)
        for campo in campos:


            # se não similares, então houve um erro
            similar[campo] = Str.similar(x[campo], y[campo])
            if not similar[campo] > Settings.porcentagemRatioSimilar:
                # se não for similar
                return {}



        # retorna todos os campos similares, por exemplo:
        # {
        #   'descricao': 0.9,
        #   'titulo': 0.8,
        # }
        return similar





    def resumir(x):
        '''nesta função, ao invés de mostrar o json, mostra-se a parte mais interessante, que o título ou o nome'''


        maisImportantes = ['titulo', 'nome']
        for i in maisImportantes:
            if i in x:
                return x[i]



        # fecha o programa para tratar esse erro
        print(x)
        raise 'Erro resumir dict'




    def compact(json):
        '''vamos supor esse dicionário:
        {
            'campo1': 'asd',
            'campo2': []',
            'campo3': {},
            'campo4': None,
            'campo5': ''
        }
        essa função irá retornar:
        {
            'campo1': 'asd',
            'campo5': ''
        }'''

        if not isinstance(json, dict):
            # já cheguei no ultimo estágio, posso voltar
            return ;

        chaves = list(json.keys())

        for chave in chaves:
            # se for uma string, não analiso
            isDict = isinstance(json[chave], dict)
            isList = isinstance(json[chave], list)

            if isDict:
                # chavo recursivamente todos os que estão em cima
                Dict.compact(json[chave])

            if isDict or isList:
                # é um {} ou um []
                # se estiver vazio, removo de json
                if not json[chave]:
                    del json[chave]







from py.Str import Str
from py.misc import *
from py.Settings import Settings