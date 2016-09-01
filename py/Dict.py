#!python3
# coding=utf-8
 ########################################################################
 # ScriptLattesDiff
 # 
 # 
 # Copyright  (C)  2010-2016  Instituto  de  Ciências  Matemáticas  e  de
 #                            Computação - ICMC/USP
 # 
 # 
 # This program is  free software; you can redistribute  it and/or modify
 # it under the  terms of the GNU General Public  License as published by
 # the Free Software Foundation; either  version 2 of the License, or (at
 # your option) any later version.
 # 
 # This program  is distributed in the  hope that it will  be useful, but
 # WITHOUT   ANY  WARRANTY;   without  even   the  implied   warranty  of
 # MERCHANTABILITY  or FITNESS  FOR A  PARTICULAR PURPOSE.   See  the GNU
 # General Public License for more details.
 # 
 # You  should have received  a copy  of the  GNU General  Public License
 # along  with  this  program;  if   not,  write  to  the  Free  Software
 # Foundation,  Inc.,  51  Franklin   Street,  Fifth  Floor,  Boston,  MA
 # 02110-1301, USA.
 # 
 # 
 # EXCEPTION TO THE TERMS AND CONDITIONS OF GNU GENERAL PUBLIC LICENSE
 # 
 # The  LICENSE  file may  contain  an  additional  clause as  a  special
 # exception  to the  terms  and  conditions of  the  GNU General  Public
 # License. This  clause, if  present, gives you  the permission  to link
 # this  program with  certain third-part  software and  to obtain,  as a
 # result, a  work based  on this program  that can be  distributed using
 # other license than the GNU General Public License.  If you modify this
 # program, you may extend this exception to your version of the program,
 # but you  are not obligated  to do so.   If you do  not wish to  do so,
 # delete this exception statement from your version.
 # 
 ########################################################################


# imports no final do arquivo





class Dict:


    '''Trata as funções de dicionário do scriptLattesDiff'''


    

    @staticmethod


    def equals(x, y):
        '''retorna True se X e Y forem iguais,
        retorna True se X e Y forem parecidos de acordo com as necessidades do scriptLattesDiff'''

        if isinstance(x, dict):
            
            for campo in ConfigFile.camposImportantes:
                if campo in x:
                    if x[campo] and y[campo]:
                        return x[campo] == y[campo]


            

            for campo in x:
                if campo in ConfigFile.camposNaoAnalisar:
                    continue

                if x[campo] != y[campo]:
                    return False

            return True

        else:
            # caso de ser uma string, principalmente
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

            return {campo: similar}

        def soAutoresBug(x):
            if 'autores' not in x:
                # se autores não estiver em x
                return False

            for campo in x:
                if campo == 'ano':
                    if x[campo] != '0':
                        # se o campo for ano, tem q ser zero
                        return False

                elif campo != 'autores':
                    if x[campo] != '':
                        return False


            # passei nos teste
            return True

        # primeiro caso: teste do doi
        if 'doi' in x:
            # não pode ser vazio nos dois
            if x['doi'] != '' and y['doi'] != '':
                if x['doi'] == y['doi']:
                    # os doi devem ser iguais
                    return {'doi': 1}

                # se o doi for diferente, continuo procurando


        # verifico se estou no caso do bug
        casoBugX = soAutoresBug(x)
        casoBugY = soAutoresBug(y)
        casoBug = casoBugX or casoBugY
        # analisa campos importantes, se um deles for parecido, retorna que é similar

        if casoBug:
            # estou no caso do bug
            if casoBugX and casoBugY:
                # os dois tão bugados
                return returnSimilar(x['autores'], y['autores'], 'autores')


            if casoBugX:
                # só o X tá bugado
                # vou inverter os pais
                novoX, novoY = y, x
            else:
                novoX, novoY = x, y

            # neste ponto, eu sei que o novoY tá bugado e o novoX não
            for campo in ConfigFile.camposImportantes:
                # se está em X, também está em Y
                if campo not in novoX:
                    continue
                # novo campo que será utilizado para comparação
                xCampo = novoX['autores']+novoX[campo]
                yCampo = novoY['autores']

                camposParaAdicionar = ['natureza', 'nome_evento', 'nome_jornal', 'livro', 'editora', 'paginas', 'ano']
                for campoParaAdicionar in camposParaAdicionar:
                    if campoParaAdicionar in novoX:
                        xCampo += novoX[campoParaAdicionar]
                
                return returnSimilar(xCampo, yCampo, campo)

            print('x:', novoX)
            print('ConfigFile.camposImportantes:', ConfigFile.camposImportantes)
            print('Erro encontrado no scriptLattes, nenhum campo foi capaz de abreviar este elemento.')
            sys.exit(0)



        # caso em que não tá bugado
        else:
            for campo in ConfigFile.camposImportantes:
                # se está em X, também está em Y
                if campo not in x:
                    continue

                # se os dois estão vazios, não posso concluir com esse algoritmo
                if x[campo] == '' and y[campo] == '':
                    # não analiso os dois vazios
                    continue

                # caso em que não 
                return returnSimilar(x[campo], y[campo], campo)


        # dicionário com o resultado de similar
        similar = {}
        # já testei os camposImportantes e não preciso testar camposNãoAnalisar
        campos = set(x.keys()) - ConfigFile.camposNaoAnalisar - ConfigFile.camposImportantes

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


        maisImportantes = ['titulo', 'nome', 'descricao', 'titulo_trabalho']
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
from py.ConfigFile import ConfigFile