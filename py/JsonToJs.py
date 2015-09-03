#!python3
# coding=utf-8



import json





class JsonToJs:

    '''esta classe é responsável salvar/ler arquivos json que são tratados como Dict em python
    e como Object em javascript'''






    # não precisa criar elementos da classe,
    # apenas chame as funções statics
    @staticmethod




    def write(fileName, varName, obj):
        '''salva o obj no arquivo
        @varName - nome da variavel que será lida pelo javascript'''

        with open(fileName, 'w', encoding='utf-8') as file:
            file.write(
                '%s = %s;' % (varName, json.dumps(obj, ensure_ascii=False))
            )
