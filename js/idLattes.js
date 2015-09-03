/**
 * Classe que será aplicada para todos os pesquisadores
 * @param  {JSON} json json obitdo do scriptLattesDiff.py
 */
var idLattes = function (json) {
	this.json = json;
}







/**
 * devolve o nome do pesquisador
 * @return {String} nome da pessoa
 */
idLattes.prototype.getNome = function() {
	return this.json['identificacao']['nome_completo'];
}





/**
 * obtem um JSON com as alterações de uma data para outra
 * @param  {String} data1 data inicial
 * @param  {String} data2 data final
 * @return {JSON}       sem as datas, apenas com + e -
 */
idLattes.prototype.getAlteracoes = function(data1, data2) {


	result = {};


	// para utilizar dentro das funções como o foreach
	var self = this;



	idLattes.camposComparativos.forEach(function (elem, index) {
		// por enquanto, só analiza a diferença do segundo dia
		var alteracoesData2 = self.json[elem][data2];
		if(alteracoesData2) {
			result[elem] = alteracoesData2;
		}
	});



	return result;

}




/**
 * resume um json obtido de um + e -, retorna uma string
 * @param  {JSON} dict do campo dps do + e -
 * @return {String}      string principal do dict
 */
idLattes.resumir = function (dict) {
	if(!(dict[0] instanceof Object)) {
		// se for uma string, retorna o dict direto
		return dict
	}
	// retorna um array, assim como recebido
	var result = new Array();



	// se ele possui um elemento que caracteriza o dicinário
	var nomesCaract = ['nome_evento', 'titulo', 'nome', 'titulo_trabalho'];
	nomesCaract.forEach(function (nome, index) {
		if(nome in dict[0]) {
			dict.forEach(function (elem, index) {
				result[index] = dict[index][nome]
				if(dict[index][nome] == '') {
					result[index] = 'CAMPO VAZIO';
				}
			});
		}
	});
	if($.isEmptyObject(result)) {
		console.log(dict);
		throw 'Não foi identificado um nome para o dicionário: '+dict;
	}
	return result;
}






/**
 * campos que devem ser comparados pela função getAlteracoes
 */
idLattes.camposComparativos = ['colaboradores', 'formacao_academica', 'projetos_pesquisa', 'premios_titulos', 'artigos_em_periodicos', 'livros_publicados', 'capitulos_livros', 'trabalho_completo_congresso', 'resumo_expandido_congresso', 'resumo_congresso', 'producao_bibliografica', 'trabalhos_tecnicos', 'producao_tecnica', 'orientacao_doutorado_em_andamento', 'orientacao_mestrado_em_andamento', 'orientacao_doutorado_concluido', 'orientacao_mestrado_concluido', 'orientacao_tcc_concluido', 'orientacao_iniciacao_cientifica_concluido', 'organizacao_evento', 'orientacao_especializacao_concluido', 'orientacao_tcc_em_andamento', 'produto_tecnologico', 'supervisao_pos_doutorado_concluido', 'orientacao_outros_tipos_concluido', 'supervisao_pos_doutorado_em_andamento', 'producao_artistica', 'orientacao_iniciacao_cientifica_em_andamento', 'artigos_em_revista', 'processo_tecnica', 'texto_em_jornal', 'orientacao_outros_tipos_em_andamento', 'participacao_evento', 'apresentacao_trabalho'];