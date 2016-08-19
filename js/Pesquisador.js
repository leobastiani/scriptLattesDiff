/**
 * Classe que será aplicada para todos os pesquisadores
 * @param  {JSON} json json obitdo do scriptLattesDiff.py
 */
var Pesquisador = function (idLattes, json) {
	this.idLattes = idLattes;
	this.json = json;
}



/**
 * Getter de json
 */
Pesquisador.prototype.getJson = function() {
	return this.json;
}


/**
 * devolve o nome do pesquisador
 * @return {String} nome da pessoa
 */
Pesquisador.prototype.getNome = function() {
	var result = this.json['identificacao']['nome_completo'];
	if(result == "[Nome-nao-identificado]") {
		// as vezes isso acontece, ai eu pego de outro campo
		return this.json['identificacao']['nome_inicial'];
	}
	return result;
}





/**
 * obtem um JSON com as alterações de uma data para outra
 * @param  {Number} iDataIni   index da data inicial
 * @param  {Number} iDataFin   index da data final
 * @return {JSON}              sem as datas, só com +, -, ~ e >
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

	// para debugar
	var considerarSempreUltimaVersao = false;


	if((iDataFin - iDataIni) == 1 || considerarSempreUltimaVersao) {
		$.each(Pesquisador.camposComparativos, function (index, campo) {
			if(!(campo in self.json)) {
				// se nessa diferença de datas
				// não houver self.json[campo]
				// por exemplo: self.json[colaboradores]
				// não ouve alteração nesse campo
				return true;
			}

			// por enquanto, só analiza a diferença do segundo dia
			var dataStr = dataFin.toStringScriptLattes();
			// se houve diferença nesse dia
			if(dataStr in self.json[campo]) {
				var alteracoesData = self.json[campo][dataStr];
				result[campo] = alteracoesData;
			}

		});

		// retorna uma cópia
		// porque quando eu for analisar mais de um dia
		// eu faço alterações nesse dicionário
		return Dict.clone(result);
	}




	// obtem as alterações de mais de duas datas


	// pega as diferenças de uma única data
	// e armazena nas variáveis
	// vamos supor 4 datas, o vetor datasProcessamento possui [0, 1, 2]
	// não fiz isso

	
	// obtem a alteração da data inicial e do dia seguinte
	result = this.getAlteracoes(iDataIni, iDataIni+1);
	// reconstroi os valores de data inicial e final
	// num loop
	// vamos supor que eu tenho 4 datas: [0, 1, 2, 3]
	// result = [(0,1)]
	// alteracoes vai ser [(1,2)]
	// depois result = [(0,2)]
	// alteracoes = [(2,3)]
	// result = [(0,3)]
	// e pronto :D
	for(var i=iDataIni+1; i < iDataFin; i++) {
		// pega as alterações da próxima data
		var alteracoes = this.getAlteracoes(i, i+1);

		// todas as chaves, presentes em result e alteracoes
		var chaves = Pesquisador.chaves(result, alteracoes);
		chaves.forEach(function (campo, index) {
			// se campo está em alteracoesAnterior, mas não está em alteracoesPosterior
			
			
			try {
				// são as alteracoes do tipo (+1) + (-1) e (-1) + (+1)
				// removidos antes e acrescido depois
				// acrescido antes e removido depois
				Pesquisador.removerRepetidos(result, alteracoes, campo, '-');
				Pesquisador.removerRepetidos(result, alteracoes, campo, '+');


				// o que foi removido antes deve continuar no removido
				// o que foi acrescido antes deve continuar no acrescido
				Pesquisador.mergeAlteracoes(result, alteracoes, campo);
			} catch(e) {
				console.log(self);
				console.log(campo);
				console.trace();
				throw "Pare";
			}
		});



		// neste ponto
		// result e alterações são iguais
		// devido a função mergeAlteracoes
	}

	return result;

}






/**
 * campos que devem ser comparados pela função getAlteracoes
 */
Pesquisador.camposComparativos = ['colaboradores', 'formacao_academica', 'projetos_pesquisa', 'premios_titulos', 'artigos_em_periodicos', 'livros_publicados', 'capitulos_livros', 'trabalho_completo_congresso', 'resumo_expandido_congresso', 'resumo_congresso', 'producao_bibliografica', 'trabalhos_tecnicos', 'producao_tecnica', 'orientacao_doutorado_em_andamento', 'orientacao_mestrado_em_andamento', 'orientacao_doutorado_concluido', 'orientacao_mestrado_concluido', 'orientacao_tcc_concluido', 'orientacao_iniciacao_cientifica_concluido', 'organizacao_evento', 'orientacao_especializacao_concluido', 'orientacao_tcc_em_andamento', 'produto_tecnologico', 'supervisao_pos_doutorado_concluido', 'orientacao_outros_tipos_concluido', 'supervisao_pos_doutorado_em_andamento', 'producao_artistica', 'orientacao_iniciacao_cientifica_em_andamento', 'artigos_em_revista', 'processo_tecnica', 'texto_em_jornal', 'orientacao_outros_tipos_em_andamento', 'participacao_evento', 'apresentacao_trabalho'];



/**
 * Se sinalAnterior = '-', tudo o que foi removido em alteracoesAnterior
 * e foi acrescido em alteracoesPosterior, deve ser removido de alteracoesPosterior e alteracoesAnterior
 * Se sinalAnterior = '+', tudo o que foi acrescido anteriormente, mas foi removido de novo,
 * ou seja, (+1) + (-1), deve ser removido de alteracoesPosterior e alteracoesAnterior
 */
Pesquisador.removerRepetidos = function (alteracoesAnterior, alteracoesPosterior, campo, sinalAnterior) {
	
	if(!alteracoesPosterior[campo] || !alteracoesAnterior[campo]) {
		// um deles está vazio
		// não há algo que foi removido no anterior e que foi acrescido
		// no posterior para eu verificar
		return ;
	}


	// sinal posterior eh sempre o contrário de anterior
	var sinalPosterior = (sinalAnterior == '-') ? '+' : '-';


	// analisa os campos removidos em alteracoesAnterior com sinalAnterior
	// e acrescidos em alteracoesPosterior com '+'
	if(alteracoesAnterior[campo][sinalAnterior] && alteracoesPosterior[campo][sinalPosterior]) {
		// se existe algum elemento nesses campos
		
		var lenAnt = alteracoesAnterior[campo][sinalAnterior].length;
		for(var indexAnterior=0; indexAnterior<lenAnt; indexAnterior++) {
			// se o sinal do anterior for '-'
			// para todos os campos removidos em alteracoesAnterior
			// se este campor for acrescido em alteracoesPosterior, remove de alteracoesPosterior
			var lenPost = alteracoesPosterior[campo][sinalPosterior].length;
			for(var indexPosterior=0; indexPosterior<lenPost; indexPosterior++) {

				// existe a possibilidade de a alteracoesAnterior[campo][sinalAnterior]
				// ficar vazio
				if(alteracoesAnterior[campo][sinalAnterior].length == 0) {
					// está vazio
					break;
				}


				var elemAnt = alteracoesAnterior[campo][sinalAnterior][indexAnterior];
				var elemPost = alteracoesPosterior[campo][sinalPosterior][indexPosterior];

				if(typeof(elemPost) == "string") {
					// se for string
					// usa o ==
					if(elemPost == elemAnt) {
						alteracoesAnterior[campo][sinalAnterior].splice(indexAnterior, 1);
						alteracoesPosterior[campo][sinalPosterior].splice(indexPosterior, 1);
						// removo um por este exemplo:
						// estou acessando o 0, removo o 0, o próximo que eu quero acessar é o 0
						indexAnterior--;
						lenPost--;
						lenAnt--;
						// parte para o proximo anterior
						break;
					}
				}

				else {
					// usa uma função especial que compara dois elementos
					if(Dict.equals(elemPost, elemAnt, campo)) {
						alteracoesAnterior[campo][sinalAnterior].splice(indexAnterior, 1);
						alteracoesPosterior[campo][sinalPosterior].splice(indexPosterior, 1);
						// removo um por este exemplo:
						// estou acessando o 0, removo o 0, o próximo que eu quero acessar é o 0
						indexAnterior--;
						lenPost--;
						lenAnt--;
						// parte para o proximo anterior
						break;
					}

				}

			}
		}



		// se o campo deixou de existir
		if(alteracoesPosterior[campo][sinalPosterior].length == 0) {
			if(!alteracoesPosterior[campo][sinalAnterior]) {
				// remove o campo pois está vazio
				delete alteracoesPosterior[campo];
			} else {
				// preseva o campo alteracoesPosterior[campo][sinalAnterior]
				delete alteracoesPosterior[campo][sinalPosterior];
			}
		}


		// se o campo deixou de existir
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





Pesquisador.mergeAlteracoes = function (alteracoesAnterior, alteracoesPosterior, campo) {
	// se não tem nada no anterior, faz com que o anterior receba o posterior
	if(!alteracoesAnterior[campo]) {
		alteracoesAnterior[campo] = alteracoesPosterior[campo];
		return ;
	}

	// mesmo caso com o posterior
	if(!alteracoesPosterior[campo]) {
		alteracoesPosterior[campo] = alteracoesAnterior[campo];
		return ;
	}

	// vou definir o alteracoesPosterior
	// e fazer o anterior ser igual


	// exemplo:
	// alteracoesAnterior[campo] = {
	//   '-': [1, 2, 3]
	//   '+': [4, 5, 6]
	// }
	// 
	// alteracoesPosterior[campo] = {
	//   '-': [7, 8, 9]
	//   '+': [10, 11, 12]
	// }
	// O resultado deve ser:
	// result[campo] = {
	//   '-': [1, 2, 3] + [7, 8, 9]
	//   '+': [4, 5, 6] + [10, 11, 12]
	// }
	
	['-', '+', '~', '>'].forEach(function (sinal, index) {		
		// se um deles está vazio, faz ser igual ao outro
		// e existe o outro
		if(!alteracoesAnterior[campo][sinal] && alteracoesPosterior[campo][sinal]) {
			// o anterior está vazio
			alteracoesAnterior[campo][sinal] = alteracoesPosterior[campo][sinal];
			return ;
		}
		else if(!alteracoesPosterior[campo][sinal] && alteracoesAnterior[campo][sinal]) {
			// o posterior está vazio
			alteracoesPosterior[campo][sinal] = alteracoesAnterior[campo][sinal];
			return ;
		}

		// se os dois existem, devo concatenar
		if(alteracoesAnterior[campo][sinal] && alteracoesPosterior[campo][sinal]) {
			// nenhum deles está vazio, devo concatenar
			var result = alteracoesAnterior[campo][sinal].concat(alteracoesPosterior[campo][sinal]);
			alteracoesAnterior[campo][sinal] = alteracoesPosterior[campo][sinal] = result;
		}
	});
}


/**
 * Obtem todas as chaves de dois dicionários
 */
Pesquisador.chaves = function (dict1, dict2) {
	var result = Object.keys(dict1).concat(Object.keys(dict2));
	return result.unique();
}



/**
 * Retorna os sinais no dict campo, se campo possuir:
 * '+', '-' e '~' retorna ['+', '-']
 * se possuir só o '+', retorna ['+']
 * se for vazio, retorna []
 */
Pesquisador.sinaisEm = function (campo) {
	if(campo == undefined) {
		return [];
	}

	var result = ['+', '-', '~', '>'];
	for(var i=0; i<result.length; i++) {
		if(!(result[i] in campo)) {
			result.splice(i, 1);
			i--;
		}
	}
	return result;
}