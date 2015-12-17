/**
 * Apenas inserindos funções para o objeto scriptLattesDiff
 */





/**
 * variaveis jquery importantes
 */
scriptLattesDiff.$ = {};



// analise temporal
$('.campoAlterado .alteradoValor').html('');
scriptLattesDiff.$.campoAlterado = $('.campoAlterado').cloneAndRemove();
// jquery membro
scriptLattesDiff.$.membro = $('.membro').cloneAndRemove();






// paginas do scriptLattesDiff que serão geradas
scriptLattesDiff.paginas = {}






/**
 * Funções importantes para o scriptLattesDiff
 */
scriptLattesDiff.paginas.principaisAlteracoes = function (dataInicial, dataFinal) {
	console.log('Gerando principaisAlteracoes para as datas:');
	console.log(dataInicial);
	console.log(dataFinal);



	// apaga todo o conteudo antigo de principaisAlteracoes
	$('#principaisAlteracoes .membro').remove();
	$('#principaisAlteracoes .filtro').remove();

	// teste se as datas não estiverem distanciadas
	if(dataFinal <= dataInicial) {
		console.log('Tentativa de gerar a principaisAlteracoes com as datas:\n'+dataInicial+'\n'+dataFinal);
		return false;
	}



	// terá os campos que foram exibidos na tela, será usado para criar o filtro
	var camposUtilizados = new Array();



	/**
	 * Adicionando todos os membros na na página HTML
	 * dentro do elemento #membros
	 */
	for(var i in scriptLattesDiff.idLattes) {
		// variáveis úteis
		var pesquisador = scriptLattesDiff.idLattes[i];
		var nome = pesquisador.getNome();




		/**
		 * obtem um dict com os campos alterados
		 */
		var iDataIni = scriptLattesDiff.datasProcessamento.indexOf(dataInicial);
		var iDataFin = scriptLattesDiff.datasProcessamento.indexOf(dataFinal);
		var alteracoes = pesquisador.getAlteracoes(iDataIni, iDataFin);

		if($.isEmptyObject(alteracoes)) {
			// se o campo está vazio, parte para o próximo elemento
			continue;
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
			for(var sinal in alteracoes[campo]) {



				// sinal é + ou -
				var campoAlteradoQuery = sinal == '+' ? '.acrescidos' : '.removidos';
				// clona o objeto
				var $campoAlterado = scriptLattesDiff.$.campoAlterado.clone();
				$campoAlterado.appendTo($membro.find(campoAlteradoQuery));


				/**
				 * atualiza os campos
				 */
				$campoAlterado.find('.alteradoChave').text(campo)
				// preenche o campo data-campo, será usado para o filtro identificar
				.attr('data-campo', campo);


				try{
					alteracoes[campo][sinal].forEach(function (dict, index) {
						$('<span>').text(scriptLattesDiff.resumirDict(dict)).appendTo($campoAlterado.find('.alteradoValor'))
						// neste campo, para conseguir adicionar o elemento completo depois
						// devo salva-lo em algum lugar
						.data('alteracoes', dict);
					});
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
					throw "Erro inesperado!";
				}



				// adiciona aos campos utilizados
				camposUtilizados.pushUnique(campo);
			}
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

		$membro.appendTo('#principaisAlteracoesContent');


	}
	

	// cria os filtros
	scriptLattesDiff.paginas.filtroPrincipaisAlterados(camposUtilizados.sort());

}







$('#principaisAlteracoes').on('click', '.alteradoValor span', function(e) {
	// expandido qr dizer q ele está mostrando tudo
	$(this).toggleClass('expandido');


	var alteracoes = $(this).data('alteracoes');
	if($(this).hasClass('expandido')) {
		// adiciona spans na forma
		// chave: valor
		
		// se alterações é uma string, como no caso de colaboradores
		// não faz nd
		console.log(typeof alteracoes);
		if(typeof alteracoes == "string") {
			return ;
		}

		var spans = new Array();
		for(var chave in alteracoes) {
			var valor = alteracoes[chave];
			spans.push(
				$('<span>').text(chave+': '+valor)
			);
		}


		// adiciona os spans no elemento atual
		$(this).html(spans);
	} else {
		$(this).text(scriptLattesDiff.resumirDict(alteracoes));
	}
});






/**
 * cria os elementos dos filtros dos principais alterados
 * @param  {Array} campos todos os campos que foram utilizados para exibir as informações na tela
 */

scriptLattesDiff.$.filtro = $('.filtro').cloneAndRemove();


scriptLattesDiff.paginas.filtroPrincipaisAlterados = function (campos) {
	

	if($.isEmptyObject(campos)) {
		// esconde o id filtros
		$('#filtros').hide();
	}
	$('#filtros').show();



	// remove todos os antigos filtros
	$('.filtro').remove();




	// cria os elementos de filtro
	campos.forEach(function (campo, index) {
		


		var $filtro = scriptLattesDiff.$.filtro.clone();
		$filtro.find('span').text(campo);
		$filtro.find('input').val(campo);


		$filtro.appendTo('#filtros');


	});



	// esconde o campo colaboradores, ele está se comportando de uma forma estranha
	$('.filtro > input[value="colaboradores"]').removeAttr('checked').change();

}









// configurando o botao de filtro
$('#filtros').on('change', '.filtro > input', function(e) {



	var checked = $(this).is(':checked');
	var campo = $(this).val(); // nome do campo




	// elemento com o campo para esconder
	var j = $('.alteradoChave[data-campo="'+campo+'"]').parent('.campoAlterado');
	if(checked) {
		j.show();
	} else {
		j.hide();
	}


	// escode akelas janelas Removidos desde então e a do acrescido
	$('.tabelaAlterados, .membro').each(function(index, elem) {
		var possuiElementosVisiveis = $(elem).find('.campoAlterado').visible().length != 0;
		if(possuiElementosVisiveis) {
			$(elem).show();
		} else {
			$(elem).hide();
		}
	});






	// adicionando listras cinzas
	$('.listraCinza').removeClass('listraCinza');
	$('.campoAlterado:visible').even().addClass('listraCinza');





});



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
	for(i=0; i<nomesCaract.length; i++) {
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