import time


class TempoDecorrido:
    '''Nessa classe, assim que fazemos um init, ela
    recebe o tempo atual e seus métodos retornam o tempo
    decorrido a partir desse início'''

    # vou setá-lo com o tempoAtual
    # no init
    comecoTime = None


    def __init__(self):
        # preciso apenas definir o começo
        self.comecoTime = TempoDecorrido.tempoAtual()




    def getSeconds(self):
        '''obtem o tempo decorrido em segundos como float'''
        return TempoDecorrido.tempoAtual() - self.comecoTime

    def getFormatted(self):
        '''retorna uma string do tipo "120.12", como se tivesse passado 120 segundos mais 12ms'''
        return str(round(TempoDecorrido.tempoAtual() - self.comecoTime, 2))


    @staticmethod
    def tempoAtual():
        # retorna o tempo atual em segundos
        return time.time()