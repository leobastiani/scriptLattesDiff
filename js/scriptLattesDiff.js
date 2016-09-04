/*
 * ScriptLattesDiff
 * 
 * 
 * Copyright  (C)  2010-2016  Instituto  de  Ciências  Matemáticas  e  de
 *                            Computação - ICMC/USP
 * 
 * 
 * This program is  free software; you can redistribute  it and/or modify
 * it under the  terms of the GNU General Public  License as published by
 * the Free Software Foundation; either  version 2 of the License, or (at
 * your option) any later version.
 * 
 * This program  is distributed in the  hope that it will  be useful, but
 * WITHOUT   ANY  WARRANTY;   without  even   the  implied   warranty  of
 * MERCHANTABILITY  or FITNESS  FOR A  PARTICULAR PURPOSE.   See  the GNU
 * General Public License for more details.
 * 
 * You  should have received  a copy  of the  GNU General  Public License
 * along  with  this  program;  if   not,  write  to  the  Free  Software
 * Foundation,  Inc.,  51  Franklin   Street,  Fifth  Floor,  Boston,  MA
 * 02110-1301, USA.
 * 
 * 
 * EXCEPTION TO THE TERMS AND CONDITIONS OF GNU GENERAL PUBLIC LICENSE
 * 
 * The  LICENSE  file may  contain  an  additional  clause as  a  special
 * exception  to the  terms  and  conditions of  the  GNU General  Public
 * License. This  clause, if  present, gives you  the permission  to link
 * this  program with  certain third-part  software and  to obtain,  as a
 * result, a  work based  on this program  that can be  distributed using
 * other license than the GNU General Public License.  If you modify this
 * program, you may extend this exception to your version of the program,
 * but you  are not obligated  to do so.   If you do  not wish to  do so,
 * delete this exception statement from your version.
 * 
 */
/**
 * Apenas inserindos funções para o objeto scriptLattesDiff
 */





/**
 * variaveis jquery importantes
 */
scriptLattesDiff.$ = {};


/**
 * Nesta função eu obtenho os jsons e apago as duplicatas na tela
 * devo chamá-la antes da cortina preta abaixar
 * ou seja, na tela de carregamento
 */
scriptLattesDiff.init = function () {
	// dá mais um step para descer a cortina preta
	Carregando.step();

	// jquery membro
	// vamos preparar ele
	var acrescidos = $('.acrescidos');
	var removidos = acrescidos.clone();
	acrescidos.after(removidos);
	removidos.removeClass('acrescidos').addClass('removidos');
	removidos.find('.alteracao-title').text('Removidos desde então');

	var alterados = $('.alterados');
	var movidos = alterados.clone();
	alterados.before(movidos);
	movidos.removeClass('alterados').addClass('movidos');
	movidos.find('.alteracao-title').text('Movidos desde então');

	// salva o membro para ser adiciona posteriormente
	scriptLattesDiff.$.membro = $('.membro').cloneAndRemove();
}




// paginas do scriptLattesDiff que serão geradas
scriptLattesDiff.paginas = {}



// retorna true se estou no protocolo file:/// ou seja, estou offline
scriptLattesDiff.isProtocoloFile = function () {
	return window.location.href.match(/^file:\/\/\//) !== null;
}

// esconde tudo oq eu qro esconder qndo é protocol-file
$(document).ready(function() {
	if(scriptLattesDiff.isProtocoloFile()) {
		$('.hide-file-protocol').hide();
	}
});



/**
 * Funções importantes para o scriptLattesDiff
 */
scriptLattesDiff.paginas.principaisAlteracoes = function (dataInicial, dataFinal) {
	console.log('Gerando principaisAlteracoes para as datas:');
	console.log(dataInicial);
	console.log(dataFinal);

	// altera o nav, embaixo do nome do grupo (que é o título)
	var headerNav = $('.jumbotron');
	headerNav.find('.data-inicial').text(new Date(dataInicial).toLocaleDateString());
	headerNav.find('.data-final').text(new Date(dataFinal).toLocaleDateString());


	// apaga todo o conteudo antigo de principaisAlteracoes
	$('#principaisAlteracoes .membro').remove();

	// teste se as datas não estiverem distanciadas
	if(dataFinal < dataInicial) {
		console.log('Tentativa de gerar a principaisAlteracoes com dataFinal antes da inicial:\n'+dataInicial+'\n'+dataFinal);
		return false;
	}



	// indices das datas no vetor que possui todas as datas
	var iDataIni = scriptLattesDiff.datasProcessamento.indexOf(dataInicial);
	var iDataFin = scriptLattesDiff.datasProcessamento.indexOf(dataFinal);


	// põe em negrito todas as linhas do footer que possuem essas datas
	var footerLi = $('footer li');
	// começa removendo de todos
	footerLi.css('font-weight', '');
	for(var i=iDataIni; i<=iDataFin; i++) {
		// coloca em text-bold todos os indices I
		footerLi.eq(i).css('font-weight', 'bold');
	}


	/**
	 * Adicionando todos os membros na na página HTML
	 * dentro do elemento #membros
	 */
	$.each(scriptLattesDiff.allIdLattes, function(i, pesquisadorId) {
		// variáveis úteis
		var pesquisador = scriptLattesDiff.idLattes[pesquisadorId];
		var nome = pesquisador.getNome();


		/**
		 * obtem um dict com os campos alterados
		 */
		var alteracoes = pesquisador.getAlteracoes(iDataIni, iDataFin);
		if($.isEmptyObject(alteracoes)) {
			// se o campo está vazio, parte para o próximo elemento
			return true;
		}




		// jquery do membro que será ponto no final
		var $membro = scriptLattesDiff.$.membro.clone();



		// nome e idlattes
		var link = 'http://lattes.cnpq.br/'+pesquisadorId;
		$membro.find('.nome').text(nome).attr('href', link);
		$membro.find('.idLattes').text(pesquisadorId).attr('href', link);



		/**
		 * testa os campos removidos
		 */
		for(var campo in alteracoes) {


			// sinal diz se foi removido ou acrescentado o item
			var firstCampoAlteradoGrupo = null;
			Pesquisador.sinaisEm(alteracoes[campo]).forEach(function (sinal) {

				// sinal é + ou -
				// exemplo de campoAlteradoQuery = '.acrescidos'
				var campoAlteradoQuery = scriptLattesDiff.paginas.getClassBySinal(sinal);
				// clona o objeto
				var $campoAlteradoGrupo = $membro.find(campoAlteradoQuery);
				var $campoAlterado = $campoAlteradoGrupo.find('.alteracao-campo:first').clone();
				// adiciona o campo no membro
				$campoAlterado.appendTo($campoAlteradoGrupo);


				/**
				 * atualiza os campos
				 */

				// este é o nome do campo que será exibido
				// em .nome-campo, aquele que fica a esquerda e diz que são
				// os elementos a direta coloridos
				var campoHtml = campo;

				// mas, no caso especial de movidos, o nome do campo será
				// campoAntigo ~> campoNovo
				if(sinal == '>') {
					// campo antigo é um dicionário que dado
					// o novo campo movido, eu digo qual é o campo antigo
					var campoAntigo = {
						// concluido desse lado                       em andamento desse lado
						'orientacao_doutorado_concluido':            'orientacao_doutorado_em_andamento',
						'orientacao_iniciacao_cientifica_concluido': 'orientacao_iniciacao_cientifica_em_andamento',
						'orientacao_mestrado_concluido':             'orientacao_mestrado_em_andamento',
						'supervisao_pos_doutorado_concluido':        'supervisao_pos_doutorado_em_andamento',
						'orientacao_outros_tipos_concluido':         'orientacao_outros_tipos_em_andamento',
						'artigos_em_periodicos':                     'artigos_em_revista',
						'artigos_em_revista':                        'artigos_em_periodicos',
					};
					campoHtml = 'De: '+campoAntigo[campo]+'\nPara: '+campo;
				}
				$campoAlterado.find('.nome-campo').textln(campoHtml)
					// preenche o campo data-campo, será usado para o filtro identificar
					.attr('data-campo', campo);


				try {

					var firstAlteracaoElemento = null;
					if(sinal == '+' || sinal == '-') {
						// caso em que uso campos de uma informação
						alteracoes[campo][sinal].forEach(function (dict, index) {

							if(firstAlteracaoElemento === null) {
								firstAlteracaoElemento = $campoAlterado.find('.alteracao-elemento:first');
							}
							var span = firstAlteracaoElemento.clone();
							span.text(scriptLattesDiff.resumirDict(dict)).appendTo($campoAlterado.find('.alteracao-elemento-grupo'))
								// neste campo, para conseguir adicionar o elemento completo depois
								// devo salva-lo em algum lugar
								.data('alteracoes', dict);

							// no caso, se o span for adicionado a um colaborador, qro tentar traduzir esse colaborador
							if(campo == 'colaboradores') {
								var idLattes = span.text();
								if(scriptLattesDiff.idLattes[idLattes] != undefined) {
									span.text(idLattes+' ('+scriptLattesDiff.idLattes[idLattes].getNome()+')');
								}
							}

						});

					}


					else if(sinal == '~' || sinal == '>') {
						// campos com duas informações, como é o caso de
						// ~
						alteracoes[campo][sinal].forEach(function (elementos, index) {
							// elementos é um array de 3 posições
							// é assim:
							// elementos = [elemComoEra, elemComoFicou, campoUtilizadoParaPercepeção]
							// sendo como cada elem é um dicionário como feito linhas a cima
							
							// primeiro cria-se um grupo
							if(firstAlteracaoElemento === null) {
								firstAlteracaoElemento = $campoAlterado.find('.alteracao-elemento-duplo:first');
							}
							var $alteradoDuplo = firstAlteracaoElemento.clone();

							// vamos inserir neles
							for(var i=0; i<2; i++) {
								$alteradoDuplo.find('.alteracao-elemento').eq(i).text(scriptLattesDiff.resumirDict(elementos[i]))
									// informações integrais desse elemento
									.data('alteracoes', elementos[i]);
							}

							// vamos adicioná-lo ao campoAlterado
							$campoAlterado.find('.alteracao-elemento-grupo').append($alteradoDuplo);
						});


					}



					else {
						console.log('Sinal "'+sinal+'" não encontrado!');
						return false;
					}

					// remove o primeiro
					if(firstAlteracaoElemento !== null) {
						firstAlteracaoElemento.remove();
					}

				} catch(e) {
					// caso ocorra um erro que não é esperado nas funções
					// de getAlteracao
					// isso é muito provavel
					// a base do programa está lá

					console.log('a = scriptLattesDiff.idLattes["'+i+'""]');
					a = scriptLattesDiff.idLattes[i.toString()];

					console.log('b = '+campo);
					b = campo;

					console.log('c = alteracoes');
					c = alteracoes;

					console.log('i:', i);
					console.log('alteracoes:', alteracoes);
					console.log('campo:', campo);
					console.log('sinal:', sinal);
					throw e;
				}

			
			});

			
		}

		// apaga os valores 1
		$membro.find('.alteracao-campo:nth-of-type(1)').remove();

		// vou remover os campos que estão vazios
		$membro.find('.alteracao-campo-grupo:not(:has(.alteracao-campo))').remove();

		$membro.appendTo('#principaisAlteracoesContent');
	}); // fim do each(i, pesquisadorId)
	

	// cria os filtros
	scriptLattesDiff.paginas.filtroPrincipaisAlterados();


	// posso tirar o fundo preto
	Carregando.finish();

}







$('#principaisAlteracoesContent').on('click', '.alteracao-elemento', function(e) {
	var alteracoes = $(this).data('alteracoes');
	// se alterações é uma string, como no caso de colaboradores
	// não faz nd
	if(typeof alteracoes == "string") {
		return ;
	}

	// quero expandir, ele não tá expandido
	if(!$(this).hasClass('expandido')) {
		// expandido qr dizer q ele está mostrando tudo
		$(this).toggleClass('expandido');

		// adiciona spans na forma
		// chave: valor
		
		var spans = new Array();
		for(var chave in alteracoes) {
			var valor = alteracoes[chave];
			if(chave == 'doi') {
				// é um doi
				valor = '<a href="'+valor+'" target="_blank">'+valor+'</a>';
				spans.push(
					$('<p>').html(chave+': '+valor)
				);
			}
			else {
				// não é um doi
				spans.push(
					$('<p>').text(chave+': '+valor)
				);
			}
			
		}

		// adiciona os spans no elemento atual
		$(this).html(spans);
	}
});


$('#principaisAlteracoesContent').on('dblclick', '.alteracao-elemento', function(e) {
	var alteracoes = $(this).data('alteracoes');
	// se alterações é uma string, como no caso de colaboradores
	// não faz nd
	if(typeof alteracoes == "string") {
		return ;
	}

	// quero contrair, ele já tá expandido
	if($(this).hasClass('expandido')) {
		// expandido qr dizer q ele está mostrando tudo
		$(this).toggleClass('expandido');
		// quero contrair
		$(this).text(scriptLattesDiff.resumirDict(alteracoes));
	}
});






/**
 * cria os elementos dos filtros dos principais alterados
 * @param  {Array} campos todos os campos que foram utilizados para exibir as informações na tela
 */

scriptLattesDiff.$.filtro = $('#filtroDeCampos .filtro').cloneAndRemove();


scriptLattesDiff.paginas.filtroPrincipaisAlterados = function() {
	// todos os campos, como string
	var campos = Filtro.todosOsCampos;

	// se eu estava usando o site e mexi nos filtros
	// quando eu clico em Pesquisar, os filtros são resetados
	// não quero que isso aconteça
	var devoRecarregarFiltros = $('#filtroDeCampos .filtro').length != 0;
	var filtro = null;
	var filtrosMarcados = null;
	if(devoRecarregarFiltros) {
		// obtenho os filtros marcados
		filtro = $('.filtro-panel:has(#filtroDeCampos)').data('filtro');
		filtrosMarcados = filtro.getFiltrosByPerfil('Marcados').vals();
	}


	// remove todos os antigos filtros
	$('#filtroDeCampos .filtro').remove();




	// cria os elementos de filtro
	campos.forEach(function (campo, index) {
		


		var $filtro = scriptLattesDiff.$.filtro.clone();
		$filtro.find('.text').text(campo);
		$filtro.find('input[type=checkbox]').val(campo);


		$filtro.appendTo('#filtroDeCampos .filtro-grupo');


	});



	if(devoRecarregarFiltros) {
		// estou recarregando a página
		filtro._carregar(Filtro.getElem(filtrosMarcados));
	}


}









// configurando o botao de filtro
$('#filtros').on('change', '.filtro input[type=checkbox]', Filtro.onchange);



/**
 * Procura a data mais próxima da data do argumento
 * @param  {Date} data
 * @return {Date}
 */
scriptLattesDiff.dataProx = function (data) {

	var len = scriptLattesDiff.datasProcessamento.length;
	var i = len-1;

	while(i >= 0) {
		var elem = scriptLattesDiff.datasProcessamento[i];
		var zeroHour = new Date(elem);
		zeroHour.setHours(0, 0, 0);

		// se a data for menor ou igual, retorna ela
		if(data >= zeroHour) {
			return elem;
		}



		i--;
	}

	// se não encontrou nenhuma
	return scriptLattesDiff.datasProcessamento[0];

}





/**
 * resume um json obtido de um + e -, retorna uma string
 * @param  {JSON} dict do campo dps do + e -
 * @return {String}      string principal do dict
 */
scriptLattesDiff.resumirDict = function (dict) {
	if(!(dict instanceof Object)) {
		// se for uma string, retorna o dict direto
		return dict;
	}
	// retorna um array, assim como recebido



	// se ele possui um elemento que caracteriza o dicinário
	var nomesCaract = [
		// pra mim
		// esses aqui são os principais
		'titulo', 'nome_evento', 'nome', 'titulo_trabalho',

		// não são os principais
		'descricao', 'autores', 'agencia_de_fomento', 'instituicao'
	];

	// nessa variável, diz que devo
	// utilizar akele nome, porém ele estava vazio
	// vou fazer a verificação no final
	// exemplo:
	// 	nomeVazio = null
	// 		gera exceção, pois nenhum nome
	// 		foi capaz de resumir esse dicionário
	// 	nomeVazio = nome_evento
	// 		return = Campo 'nome' vazio!
	var nomeVazio = null;
	for(var i=0; i<nomesCaract.length; i++) {
		var nome = nomesCaract[i];
		if(!(nome in dict)) {
			continue;
		}


		if(dict[nome] == '') {
			// o campo está vazio
			if(nomeVazio == null) {
				nomeVazio = nome;
			}
		}
		else {
			// o campo não está vazio, retorna-o
			return dict[nome];
		}
	}

	// se foi encontrado o nome, porém ele estava vazio
	if(nomeVazio != null) {
		return 'Campo "'+nomeVazio+'" vazio.';
	}


	/**
	 * Nenhum dos nomesCaract foram utilizados para resumir esse dicionário
	 * vou lançar uma exceção e tratá-la
	 * anilsar o dicionário e descobrir
	 * que palavra caracteriza-o melhor
	 */
	var msg = 'Não foi possível resumir o dicionário:';
	console.log(msg);
	console.log(dict);
	throw msg;
}




/**
 * retorna o nome da classe da tabelaAlterados
 */
scriptLattesDiff.paginas.getClassBySinal = function (sinal) {
	if(sinal == '+') {
		return '.acrescidos';
	}

	else if(sinal == '-') {
		return '.removidos';
	}


	else if(sinal == '>') {
		return '.movidos';
	}


	else if(sinal == '~') {
		return '.alterados';
	}

	else {
		// erro, sinal não encontrado
		throw new Error('Sinal "'+sinal+'" não encontrado em scriptLattesDiff.paginas.getClassBySinal');
	}
}




scriptLattesDiff.navegadorAtualizado = function (funcionalidade) {
	try {
		if(typeof funcionalidade === 'undefined') {
			throw null;
		}
	} catch(e) {
		alert('Por favor, utilize um navegador atualizado.');
		throw null;
	}
}