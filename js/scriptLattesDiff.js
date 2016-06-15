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


	// começa apagando os elementos e copiando na memória
	$('.campoAlterado .alteradoValor').html('');
	// o campoAlterado da tabela de alterados é diferente, olha ele ai:
	scriptLattesDiff.$.campoAlteradoAlterados = $('.alterados').find('.campoAlterado').cloneAndRemove();
	// esse é para o caso genérico, de .acrecidos e .removidos
	scriptLattesDiff.$.campoAlterado = $('.campoAlterado').cloneAndRemove();
	// jquery membro
	scriptLattesDiff.$.membro = $('.membro').cloneAndRemove();
}




// paginas do scriptLattesDiff que serão geradas
scriptLattesDiff.paginas = {}



// retorna true se estou no protocolo file:/// ou seja, estou offline
scriptLattesDiff.isProtocoloFile = function () {
	return window.location.href.match(/^file:\/\/\//);
}



/**
 * Funções importantes para o scriptLattesDiff
 */
scriptLattesDiff.paginas.principaisAlteracoes = function (dataInicial, dataFinal) {
	console.log('Gerando principaisAlteracoes para as datas:');
	console.log(dataInicial);
	console.log(dataFinal);

	// altera o nav, embaixo do nome do grupo (que é o título)
	var headerNav = $('header nav');
	headerNav.find('span:eq(0)').text(new Date(dataInicial).toLocaleDateString());
	headerNav.find('span:eq(1)').text(new Date(dataFinal).toLocaleDateString());


	// apaga todo o conteudo antigo de principaisAlteracoes
	$('#principaisAlteracoes .membro').remove();

	// teste se as datas não estiverem distanciadas
	if(dataFinal <= dataInicial) {
		console.log('Tentativa de gerar a principaisAlteracoes com dataFinal antes da inicial:\n'+dataInicial+'\n'+dataFinal);
		return false;
	}



	// indices das datas no vetor que possui todas as datas
	var iDataIni = scriptLattesDiff.datasProcessamento.indexOf(dataInicial);
	var iDataFin = scriptLattesDiff.datasProcessamento.indexOf(dataFinal);


	// põe em negrito todas as linhas do footer que possuem essas datas
	var footerLi = $('footer li');
	// começa removendo de todos
	footerLi.removeClass('negrito');
	for(var i=iDataIni; i<=iDataFin; i++) {
		// coloca em negrito todos os indices I
		footerLi.eq(i).addClass('negrito');
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
		$membro.find('.nome').text(nome);
		$membro.find('.idLattes').text(i);




		/**
		 * testa os campos removidos
		 */
		for(var campo in alteracoes) {


			// sinal diz se foi removido ou acrescentado o item
			Pesquisador.sinaisEm(alteracoes[campo]).forEach(function (sinal) {

				// sinal é + ou -
				// exemplo de campoAlteradoQuery = '.acrescidos'
				var campoAlteradoQuery = scriptLattesDiff.paginas.getClassBySinal(sinal);
				// clona o objeto
				var $campoAlterado;
				if(sinal == '~') {
					// o campo de alterados é diferente, por isso, vamos trabalhar com ele a parte
					$campoAlterado = scriptLattesDiff.$.campoAlteradoAlterados.clone();
				}
				else {
					// campos comuns
					$campoAlterado = scriptLattesDiff.$.campoAlterado.clone();
				}
				$campoAlterado.appendTo($membro.find(campoAlteradoQuery));


				/**
				 * atualiza os campos
				 */

				// este é o nome do campo que será exibido
				// em .alteradoChave, aquele que fica a esquerda e diz que são
				// os elementos a direta coloridos
				var campoHtml = campo;

				// mas, no caso especial de movidos, o nome do campo será
				// campoAntigo ~> campoNovo
				if(sinal == '>') {
					// campo antigo é um dicionário que dado
					// o novo campo movido, eu digo qual é o campo antigo
					var campoAntigo = {
						// concluido desse lado                em andamento desse lado
						'orientacao_doutorado_concluido':     'orientacao_doutorado_em_andamento',
						'orientacao_mestrado_concluido':      'orientacao_mestrado_em_andamento',
						'supervisao_pos_doutorado_concluido': 'supervisao_pos_doutorado_em_andamento',
						'orientacao_outros_tipos_concluido':  'orientacao_outros_tipos_em_andamento',
						'artigos_em_periodicos':              'artigos_em_revista',
					};
					campoHtml = 'De: '+campoAntigo[campo]+'\nPara: '+campo;
				}

				$campoAlterado.find('.alteradoChave').text(campoHtml)
					// agora eu troco os \n por <br>
					.html(function(index, html) { return html.replace('\n', '<br>'); })
					// preenche o campo data-campo, será usado para o filtro identificar
					.attr('data-campo', campo);


				try {

					if(sinal == '+' || sinal == '-' || sinal == '>') {
						// caso em que uso campos de uma informação
						alteracoes[campo][sinal].forEach(function (dict, index) {


							if(sinal == '>') {
								// quando estou trabalhando com movidos, tenho o caso especial
								// porque não é exatamente dict que estou recebendo de cada alteracoes[campo][sinal]
								// cada dict é dessa forma:
								// [
								//   elemAntigo,
								//   elemNovo,
								//   {'campo': ratio}
								// ]
								// portanto, o novo dict será o elemNovo
								dict = dict[1];
							}


							$('<span>').text(scriptLattesDiff.resumirDict(dict)).appendTo($campoAlterado.find('.alteradoValor'))
								// neste campo, para conseguir adicionar o elemento completo depois
								// devo salva-lo em algum lugar
								.data('alteracoes', dict);

						});

					}


					else if(sinal == '~') {
						// campos com duas informações, como é o caso de
						// ~
						alteracoes[campo][sinal].forEach(function (elementos, index) {
							// elementos é um array de 3 posições
							// é assim:
							// elementos = [elemComoEra, elemComoFicou, campoUtilizadoParaPercepeção]
							// sendo como cada elem é um dicionário como feito linhas a cima
							
							// primeiro cria-se um grupo
							var $alteradoGrupo = $('<div>').addClass('alteradoGrupo');

							// vamos inserir neles
							for(var i=0; i<2; i++) {
								$('<span>').text(scriptLattesDiff.resumirDict(elementos[i])).appendTo($alteradoGrupo)
									// informações integrais desse elemento
									.data('alteracoes', elementos[i]);
							}

							// vamos adicioná-lo ao campoAlterado
							$alteradoGrupo.appendTo($campoAlterado.find('.alteradoValor'));

						});
					}



					else {
						console.log('Sinal "'+sinal+'" não encontrado!');
						return false;
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


		/**
		 * remove o primeiro elemento
		 */
		if($membro.find('.acrescidos .campoAlterado').length == 0) {
			$membro.find('.acrescidos').remove();
		}
		if($membro.find('.removidos .campoAlterado').length == 0) {
			$membro.find('.removidos').remove();
		}
		/*if($membro.find('.alterados .campoAlterado').length == 0) {
			$membro.find('.alterados').remove();
		}*/

		$membro.appendTo('#principaisAlteracoesContent');
	});
	

	// cria os filtros
	scriptLattesDiff.paginas.filtroPrincipaisAlterados();

}







$('#principaisAlteracoes').on('click', '.alteradoValor span', function(e) {
	alteracoes = $(this).data('alteracoes');
	// se alterações é uma string, como no caso de colaboradores
	// não faz nd
	if(typeof alteracoes == "string") {
		return ;
	}


	// expandido qr dizer q ele está mostrando tudo
	$(this).toggleClass('expandido');


	if($(this).hasClass('expandido')) {
		// adiciona spans na forma
		// chave: valor
		
		var spans = new Array();
		for(var chave in alteracoes) {
			var valor = alteracoes[chave];
			spans.push(
				$('<span>').text(chave+': '+valor)
			);
		}


		// adiciona os spans no elemento atual
		$(this).html(spans);
	}
	else {
		// quero contrair
		$(this).text(scriptLattesDiff.resumirDict(alteracoes));

	}
});






/**
 * cria os elementos dos filtros dos principais alterados
 * @param  {Array} campos todos os campos que foram utilizados para exibir as informações na tela
 */

scriptLattesDiff.$.filtro = $('#filtrosComuns .filtro').cloneAndRemove();


scriptLattesDiff.paginas.filtroPrincipaisAlterados = function() {
	// todos os campos, como string
	var campos = Filtro.todosOsCampos;

	// se eu estava usando o site e mexi nos filtros
	// quando eu clico em Pesquisar, os filtros são resetados
	// não quero que isso aconteça
	var devoRecarregarFiltros = $('#filtrosComuns .filtro').length != 0;
	var filtrosMarcados = null;
	if(devoRecarregarFiltros) {
		// obtenho os filtros marcados
		filtrosMarcados = Filtro.getFiltrosByPerfil('Marcados').vals();
	}


	// remove todos os antigos filtros
	$('#filtrosComuns .filtro').remove();




	// cria os elementos de filtro
	campos.forEach(function (campo, index) {
		


		var $filtro = scriptLattesDiff.$.filtro.clone();
		$filtro.find('span').text(campo);
		$filtro.find('input').val(campo);


		$filtro.appendTo('#filtrosComuns');


	});



	if(devoRecarregarFiltros) {
		// estou recarregando a página
		Filtro._carregar(Filtro.getElem(filtrosMarcados));
	}


}









// configurando o botao de filtro
$('#filtros').on('change', '.filtro > input', Filtro.onchange);



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
