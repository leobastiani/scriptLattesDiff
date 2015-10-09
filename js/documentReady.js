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
		$('#datasProcessamento ul').append($('<li>').text(elem.toStringScriptLattes()));
	});
	// e nos calendários do principaisAlteracoes
	var datasCalendario = [scriptLattesDiff.datasProcessamento[0], scriptLattesDiff.datasProcessamento.end()];
	$('#principaisAlteracoes #escolhaDatas input[type="date"]').each(function(index, el) {
		$(this).val(datasCalendario[index].toValDate());
	});






	/**
	 * cria as principais páginas do meu script
	 */
	scriptLattesDiff.paginas.principaisAlteracoes(
		scriptLattesDiff.datasProcessamento[0],   // data inicial
		scriptLattesDiff.datasProcessamento.end() // data final
	);





	$('#escolhaDatas input[type="submit"]').click(function(e) {
		// obtendo os valores das datas
		var $datas = $('#escolhaDatas input[type="date"]');
		var dataInicial = scriptLattesDiff.dataProx($datas.eq(0).getDate());
		var dataFinal   = scriptLattesDiff.dataProx($datas.eq(1).getDate());



		// encontra as datas que estão em datasProcessamento
		if(dataFinal < dataInicial) {
			// swap de variaveis
			var temp = $datas.eq(1).val();
			$datas.eq(0).val($datas.eq(1).val());
			$datas.eq(1).val(temp);


			temp = dataInicial;
			dataInicial = dataFinal;
			dataFinal = temp;
		}


		// após o ajuste de periodos
		scriptLattesDiff.paginas.principaisAlteracoes(dataInicial, dataFinal);

	});

	
}