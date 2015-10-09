/**
 * Classe que será aplicada para todos os pesquisadores
 * @param  {JSON} json json obitdo do scriptLattesDiff.py
 */
var Pesquisador = function (json) {
	this.json = json;
}





/**
 * devolve o nome do pesquisador
 * @return {String} nome da pessoa
 */
Pesquisador.prototype.getNome = function() {
	return this.json['identificacao']['nome_completo'];
}





/**
 * obtem um JSON com as alterações de uma data para outra
 * @param  {Number} iDataIni   index da data inicial
 * @param  {Number} iDataFin index da data final
 * @return {JSON}            sem as datas, só com + e -
 */
Pesquisador.prototype.getAlteracoes = function(iDataIni, iDataFin) {

	// index da data
	var dataIni = scriptLattesDiff.datasProcessamento[iDataIni];
	var dataFin = scriptLattesDiff.datasProcessamento[iDataFin];

	/**
	 * result chaves com os valores dos campos
	 * os campos terão chaves com valores + e -
	 * as chaves + e - terão valores com os elementos
	 * @type {JSON}
	 */
	var result = {};


	// para utilizar dentro das funções como o foreach
	var self = this;


	if((iDataFin - iDataIni) == 1) {
		Pesquisador.camposComparativos.forEach(function (elem, index) {
			// por enquanto, só analiza a diferença do segundo dia
			var alteracoesData = self.json[elem][dataFin.toStringScriptLattes()];
			if(alteracoesData) {
				// retorna uma cópia
				result[elem] = Dict.clone(alteracoesData);
				console.log('alteracoesData', elem, alteracoesData);
			}
		});
		return result;
	}




	// obtem as alterações de mais de dois dias
	
	// obtem a alteração da data inicial e do dia seguinte
	result = this.getAlteracoes(iDataIni, iDataIni+1);
	// reconstroi os valores de data inicial e final
	// num loop
	for(iDataIni=iDataIni+1; iDataIni < iDataFin; iDataIni++) {
		// pega as alterações da próxima data
		var alteracoes = this.getAlteracoes(iDataIni, iDataFin);


		for(var campo in result) {
			// se campo está em alteracoesAnterior, mas não está em alteracoesPosterior
			
			
			// são as alteracoes do tipo (+1) + (-1) e (-1) + (+1)
			// removidos antes e acrescido depois
			// acrescido antes e removido depois

			Pesquisador.removerRepetidos(result, alteracoes, campo, '-');
			Pesquisador.removerRepetidos(result, alteracoes, campo, '+');


			// TODO: o que foi removido antes deve continuar no removido
			// o que foi acrescido antes deve continuar no acrescido

			Pesquisador.mergeAlteracoes(result, alteracoes, campo, '-');
			Pesquisador.mergeAlteracoes(result, alteracoes, campo, '+');

		}



		// já filtrei tudo o que tinha q filtar em alteracoes
		// apaga o conteudo de result
		result = alteracoes;

	}


	return result;

}






/**
 * campos que devem ser comparados pela função getAlteracoes
 */
Pesquisador.camposComparativos = ['colaboradores', 'formacao_academica', 'projetos_pesquisa', 'premios_titulos', 'artigos_em_periodicos', 'livros_publicados', 'capitulos_livros', 'trabalho_completo_congresso', 'resumo_expandido_congresso', 'resumo_congresso', 'producao_bibliografica', 'trabalhos_tecnicos', 'producao_tecnica', 'orientacao_doutorado_em_andamento', 'orientacao_mestrado_em_andamento', 'orientacao_doutorado_concluido', 'orientacao_mestrado_concluido', 'orientacao_tcc_concluido', 'orientacao_iniciacao_cientifica_concluido', 'organizacao_evento', 'orientacao_especializacao_concluido', 'orientacao_tcc_em_andamento', 'produto_tecnologico', 'supervisao_pos_doutorado_concluido', 'orientacao_outros_tipos_concluido', 'supervisao_pos_doutorado_em_andamento', 'producao_artistica', 'orientacao_iniciacao_cientifica_em_andamento', 'artigos_em_revista', 'processo_tecnica', 'texto_em_jornal', 'orientacao_outros_tipos_em_andamento', 'participacao_evento', 'apresentacao_trabalho'];




Pesquisador.removerRepetidos = function (alteracoesAnterior, alteracoesPosterior, campo, sinalAnterior) {

	if(!alteracoesPosterior[campo] || !alteracoesAnterior[campo]) {
		return ;
	}


	// sinal posterior eh sempre o contrário de anterior
	var sinalPosterior = (sinalAnterior == '-') ? '+' : '-';


	// analisa os campos removidos em alteracoesAnterior com sinalAnterior
	// e acrescidos em alteracoesPosterior com '+'
	if(alteracoesAnterior[campo][sinalAnterior] && alteracoesPosterior[campo][sinalPosterior]) {
		alteracoesAnterior[campo][sinalAnterior].forEach(function (removido, index) {
			// para todos os campos removidos em alteracoesAnterior
			// se este campor for acrescido em alteracoesPosterior, remove de alteracoesPosterior
			alteracoesPosterior[campo][sinalPosterior] = alteracoesPosterior[campo][sinalPosterior].filter(function (elem) {
				// TODO: trocar == por .equals
				if(elem == removido) {
					alteracoesAnterior[campo][sinalAnterior].splice(index, 1);
					return false;
				}
				return true;
			});
		});



		if(alteracoesPosterior[campo][sinalPosterior].length == 0) {
			if(!alteracoesPosterior[campo][sinalAnterior]) {
				// remove o campo pois está vazio
				delete alteracoesPosterior[campo];
			} else {
				// preseva o campo alteracoesPosterior[campo][sinalAnterior]
				delete alteracoesPosterior[campo][sinalPosterior];
			}
		}


		if(alteracoesAnterior[campo][sinalAnterior].length == 0) {
			if(!alteracoesAnterior[campo][sinalPosterior]) {
				// remove o campo pois está vazio
				delete alteracoesAnterior[campo];
			} else {
				// preseva o campo alteracoesAnterior[campo][sinalAnterior]
				delete alteracoesAnterior[campo][sinalAnterior];
			}
		}


	}


}





Pesquisador.mergeAlteracoes = function (alteracoesAnterior, alteracoesPosterior, campo, sinalAnterior) {
	if(!alteracoesPosterior[campo] || !alteracoesAnterior[campo]) {
		return ;
	}


	if(!alteracoesAnterior[campo][sinalAnterior]) {
		// se não houve alteração anterior, não tem o que propagar
		return ;
	}
	if(!alteracoesPosterior[campo]) {
		// caso de que não há nada acrescido nem retirado
		alteracoesPosterior[campo] = {sinalAnterior: alteracoesAnterior[campo][sinalAnterior]};
	} else if(alteracoesPosterior[campo][sinalAnterior]) {
		// caso de também haver alterações em alteracoesPosterior
		alteracoesPosterior[campo][sinalAnterior] = $.merge(alteracoesAnterior[campo][sinalAnterior], alteracoesPosterior[campo][sinalAnterior]);
	} else {
		// não há alterações em posterior,
		// então as alterações feitas nesta data permanecem iguais a da data anterior
		alteracoesPosterior[campo][sinalAnterior] = alteracoesAnterior[campo][sinalAnterior];
	}
}