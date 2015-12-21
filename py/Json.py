#!python3
# coding=utf-8



import json





class Json:

    '''esta classe é responsável salvar/ler arquivos json que são tratados como Dict em python
    e como Object em javascript'''






    # não precisa criar elementos da classe,
    # apenas chame as funções statics
    @staticmethod




    def writeToJs(filePath, varName, obj):
        '''salva o obj no arquivo
        @varName - nome da variavel que será lida pelo javascript'''

        with open(filePath, 'w', encoding='utf-8') as file:
            file.write(
                '%s = %s;' % (varName, Json.toString(obj))
            )


    def toString(obj):
        return json.dumps(obj,
            sort_keys=True,
            indent=4,
            separators=(',', ': '),
            ensure_ascii=False
        )