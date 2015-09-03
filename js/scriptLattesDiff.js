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


	// apaga todo o conteudo de principaisAlteracoes
	$('#principaisAlteracoes .membro').remove();
	$('#principaisAlteracoes .filtro').remove();



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
		var alteracoes = pesquisador.getAlteracoes(dataInicial, dataFinal);


		if($.isEmptyObject(alteracoes)) {
			// se o campo está vazio, parte para o próximo elemento
			continue;
		}




		// jquery do membro que será ponto no final
		jMembro = scriptLattesDiff.$.membro.clone();



		// nome e idlattes
		jMembro.find('.nome').text(nome);
		jMembro.find('.idLattes').text(i);




		/**
		 * testa os campos removidos
		 */
		for(var campo in alteracoes) {



			// sinal diz se foi removido ou acrescentado o item
			for(var sinal in alteracoes[campo]) {



				// sinal é + ou -
				var campoAlteradoQuery = sinal == '+' ? '.acrescidos' : '.removidos';
				// clona o objeto
				var jCampoAlterado = scriptLattesDiff.$.campoAlterado.clone();
				jCampoAlterado.appendTo(jMembro.find(campoAlteradoQuery));


				/**
				 * atualiza os campos
				 */
				jCampoAlterado.find('.alteradoChave').text(campo)
				// preenche o campo data-campo, será usado para o filtro identificar
				.attr('data-campo', campo);



				var frasesResumidas = idLattes.resumir(alteracoes[campo][sinal]);
				frasesResumidas.forEach(function (frase, index) {
					$('<span>').text(frase).appendTo(jCampoAlterado.find('.alteradoValor'));
				});



				// adiciona aos campos utilizados
				camposUtilizados.pushUnique(campo);
			}
		}


		/**
		 * remove o primeiro elemento
		 */
		if(jMembro.find('.acrescidos .campoAlterado').length == 0) {
			jMembro.find('.acrescidos').remove();
		}
		if(jMembro.find('.removidos .campoAlterado').length == 0) {
			jMembro.find('.removidos').remove();
		}

		jMembro.appendTo('#principaisAlteracoesContent');


	}
	

	// cria os filtros
	scriptLattesDiff.paginas.filtroPrincipaisAlterados(camposUtilizados);

}






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
		


		var jFiltro = scriptLattesDiff.$.filtro.clone();
		jFiltro.find('span').text(campo);
		jFiltro.find('input').val(campo);


		jFiltro.appendTo('#filtros');


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