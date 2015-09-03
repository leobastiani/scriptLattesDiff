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
	 * cria as principais páginas do meu script
	 */
	scriptLattesDiff.paginas.principaisAlteracoes(
		scriptLattesDiff.datasProcessamento[0], // data inicial
		scriptLattesDiff.datasProcessamento.end() // data final
	);


	
}