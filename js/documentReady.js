/**
 * função que deve ser chamada no lugar de $(document).ready,
 * pois ela será chamada assim que todos os jsons forem carregados
 * @param  {event} e
 */
function documentReady() {
	
	/**
	 * Começa alterando o título da página e o nome do grupo
	 */
	document.title = scriptLattesDiff.nomeDoGrupo;
	$('#nomeDoGrupo').text(scriptLattesDiff.nomeDoGrupo);



	/**
	 * Coloca as datas no devido lugar
	 */
	scriptLattesDiff.datasProcessamento.forEach(function (elem, index) {
		// adiciona um elemento na lista do elemento datasProcessamento
		$('#datasProcessamento ul').append($('<li>').text(elem));
	});



	/**
	 * Adicionando todos os membros na na página HTML
	 * dentro do elemento #membros
	 */
	var jMembro = $('.membro').clone();
	// remove-se o elemento que só está na página como modelo
	$('.membro').remove();
	var i; // valor do i de cada membro
	for(i in scriptLattesDiff.idLattes) {
		// variáveis úteis
		var elem = scriptLattesDiff.idLattes[i];
		var nome = elem.getNome();

		/**
		 * obtem um dict com os campos alterados
		 */
		var alteracoes = elem.getAlteracoes(scriptLattesDiff.datasProcessamento[0], scriptLattesDiff.datasProcessamento[1]);


		if($.isEmptyObject(alteracoes)) {
			// se o campo está vazio, parte para o próximo elemento
			continue;
		}

		var jElem = jMembro.clone();
		jElem.find('.nome').text(nome);
		jElem.find('.idLattes').text(i);


		/**
		 * testa os campos removidos
		 */
		for(var campo in alteracoes) {
			for(var ch in alteracoes[campo]) {
				// ch é + ou -
				var campoAlteradoQuery = ch == '+' ? '.acrescidos' : '.removidos';
				// clona o objeto
				var jCampoAlterado = jElem.find(campoAlteradoQuery+' .campoAlterado:first').clone();
				jCampoAlterado.appendTo(jElem.find(campoAlteradoQuery));


				/**
				 * atualiza os campos
				 */
				jCampoAlterado.find('.alteradoChave').text(campo);
				jCampoAlterado.find('.alteradoValor').textln(idLattes.resumeDict(alteracoes[campo][ch]).join('\n\n'));

			}
		}


		/**
		 * remove o primeiro elemento
		 */
		jElem.find('.acrescidos .campoAlterado:first, .removidos .campoAlterado:first').remove();
		if(jElem.find('.acrescidos .campoAlterado').length == 0) {
			jElem.find('.acrescidos').remove();
		}
		if(jElem.find('.removidos .campoAlterado').length == 0) {
			jElem.find('.removidos').remove();
		}

		jElem.appendTo('#principaisAlteracoesContent');
	};


	
}


$.fn.textln = function (txt) {
	if($(this)) {
		$(this).text(txt);
		$(this).html($(this).html().replace(/\n/gm, '<br>'));
	}
}