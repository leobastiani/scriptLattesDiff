#!python3
# coding=utf-8


import time
import os
import xml.etree.ElementTree as ElementTree
from pathlib import Path
from py.misc import *




class ConfigFile:
    '''Classe que trata um arquivo de configuração'''



    filePath = None # local do arquivo de configuracao, instancia de Path
    parametros = None # parametros carregados do arquivo de configuracao
    xml = None # o arquivo xml carregado de configFile
    json = None # formatacao em json do xml
    data_processamento = None # data de processamento do grupo






    # as maneiras de como os dados deve ser mantidos na hora da comparação entre configFiles
    manterDados = {
        'novosDados': set([ # set, pois trabalha mais rápido do que uma list
            # aqui, os dados novos repetidos são apagados,
            # e são mantidos apenas os que não estavam presentes
            'colaboradores', 'formacao_academica', 'projetos_pesquisa', 'premios_titulos', 'artigos_em_periodicos', 'livros_publicados', 'capitulos_livros', 'trabalho_completo_congresso', 'resumo_expandido_congresso', 'resumo_congresso', 'producao_bibliografica', 'trabalhos_tecnicos', 'producao_tecnica', 'orientacao_doutorado_em_andamento', 'orientacao_mestrado_em_andamento', 'orientacao_doutorado_concluido', 'orientacao_mestrado_concluido', 'orientacao_tcc_concluido', 'orientacao_iniciacao_cientifica_concluido', 'organizacao_evento', 'orientacao_especializacao_concluido', 'orientacao_tcc_em_andamento', 'produto_tecnologico', 'supervisao_pos_doutorado_concluido', 'orientacao_outros_tipos_concluido', 'supervisao_pos_doutorado_em_andamento', 'producao_artistica', 'orientacao_iniciacao_cientifica_em_andamento', 'artigos_em_revista', 'processo_tecnica', 'texto_em_jornal', 'orientacao_outros_tipos_em_andamento', 'participacao_evento', 'apresentacao_trabalho'
        ]),
        'maisNovo': [
            # aqui ficam os dados que não são necessários para comparação
            'identificacao', 'idiomas', 'endereco', 'area_atuacao'
        ]
    }









    def __init__(self, filePath):
        '''filePath é o path do arquivo de configuração'''

        self.filePath = Path(os.getcwd(), filePath)
        section('Novo arquivo de configuração carregado:', self.filePath)
        with open(filePath, 'r') as fp:
            self.carregarParametros(fp)
        self.loadXml()
        self.data_processamento = self.xml.getroot().attrib['data_processamento']
        # obtem uma instancia de time pela data de processamento
        self.time = self.strToData(self.data_processamento)
        self.loadJsonFromXml()







    def printPesquisador(self, pesquisador):
        '''Imprime numa linha o dicionário pesquisador com o ID e o nome
        param: pesquisador => Id do pesquisador'''
        print('Pesquisador: %s, Nome: %s' % (pesquisador, self.json[pesquisador]['identificacao']['nome_inicial']))









    def carregarParametros(self, fp):
        '''Carrega as configurações para a variável parametros do arquivo de configuração'''
        self.parametros = {}
        def getParametro(line):
            '''Retorna uma tupla (nomeDoParametro, valor)
            ou (False, False) caso erro'''
            line = line.strip() # remove o \n do final da linha
            line = line.partition('#')[0] # remove os comentários
            lineDiv = line.split('=') # obtem uma linha dividida
            if len(lineDiv) == 2:
                return lineDiv[0].strip(), lineDiv[1].strip()
            else:
                return False, False
        for line in fp:
            paramName, value = getParametro(line)
            if paramName:
                self.parametros[paramName] = value








    def getParametro(self, paramName):
        '''Obtem um parâmetro do arquivo de configuração'''
        return self.parametros[paramName]











    def getOutputFolder(self):
        '''Retorna o Path da pasta de saída do arquivo de configuração'''
        # começa contando de sys.argv[0] que é o path do script .py
        return Misc.scriptPath / self.getParametro('global-diretorio_de_saida')







    def getXmlFilePath(self):
        return self.getOutputFolder() / (self.getParametro('global-prefixo')+'-database.xml')







    def loadXml(self):
        xmlFilePath = self.getXmlFilePath()
        print('Carregando arquivo xml: ', self.getXmlFilePath())
        self.xml = ElementTree.parse(str(xmlFilePath))
        return self.xml










    def loadJsonFromXml(self):
        root = self.xml.getroot()
        self.json = {}

        def childNomeComum(xml):
            children = xml.getchildren()
            if len(children) < 2:
                return ''
            elif children[0].tag == children[1].tag:
                return children[0].tag
            return ''

        def _xmlToJson(xml):
            result = {}
            # se for filho, retorna seu valor
            if not xml.getchildren():
                return xml.text if xml.text else ''
            # se não for filho, retorna um dicionário
            for child in xml:
                if result.get(child.tag):
                    # se já existe esse elemento dentro de result
                    # soma-se o resultado ao vetor
                    result[child.tag] += [_xmlToJson(child)]
                else:
                    # se não, cria um novo vetor
                    result[child.tag] = [_xmlToJson(child)]
            return result

        def compactJson(json):
            '''Os valores de json estão sempre em listas
            esta função deixa o que é lista como lista
            e o que não deve ser lista, como elemento único'''
            # apos ter recebidos todos os parametros
            # deixa o que é lista, e retira a lista de qm precisa
            tratarComoLista = ConfigFile.manterDados['novosDados'].union(['colaboradores', 'idiomas', 'area_atuacao'])
            for child in tratarComoLista:
                # verifica se child esta em json
                if child in json:
                    # apenas ovtem o elemento correto
                    json[child] = list(json[child][0].values())[0]
                    # os elementos desse json são um array, deixa como valores simples
                    if child in ['colaboradores', 'idiomas', 'area_atuacao']:
                        continue
                    for i in json[child]:
                        for filho in i:
                            i[filho] = i[filho][0]
                else:
                    # cria um novo elemento para ter sempre todos os elementos para comparar
                    json[child] = []
            # agora, compara os childs se não são listas
            def naoSaoListas(json):
                if isinstance(json, str):
                    # cheguei numa string já, não preciso continuar
                    return
                for child in json:
                    if child not in tratarComoLista:
                        json[child] = json[child][0]
                        # chama recursivo para os filhos dele
                        naoSaoListas(json[child])
            naoSaoListas(json)

        for pesquisador in root:
            i = pesquisador.attrib['id'] # deve ser tratado como string
            # para evitar o caso de 0001
            self.json[i] = _xmlToJson(pesquisador)
            compactJson(self.json[i])
            self.printPesquisador(i)
        return self.json










    def __str__(self):
        return str(self.filePath)









    @staticmethod

    def strToData(str):
        '''Transfomr uma string obtida dos arquivos XML do scriptLattes
        Exemplo de String: 01/01/1970 23:59:59'''
        return time.strptime(str, '%d/%m/%Y %H:%M:%S')