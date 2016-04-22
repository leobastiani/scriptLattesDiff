/**
 * função que deve ser chamada no lugar de $(document).ready,
 * pois ela será chamada assim que todos os jsons forem carregados
 * @param  {event} e
 */
function documentReady() {

	console.log('Todos os arquivos foram carregados!');
	scriptLattesDiff.init()
	
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
	// agora coloca no combobox embaixo das datas de pesquisa
	$('#datasComboIni, #datasComboFim').each(function(index, elem) {
		$.each(scriptLattesDiff.datasProcessamento, function(index, data) {
			var dataVal = data.toValDate();
			var option = $('<option>').text(dataVal).val(dataVal);

			option.appendTo($(elem));
		});

		// atribui a função dos datasCombo, qndo eu mudar o valor de datacombo devo alterar o valor da input date
		$(elem).change(function(e) {
			if($(this).val() == '') {
				// se vim pro vazio, não faço nd
				return ;
			}
			// selecionei uma data
			var devoMudar = $(this).parent('div').find('input');
			devoMudar.val($(this).val());

			// volta para o estado inicial
			$(this).val('');
		});
	});






	/**
	 * cria as principais páginas do meu script
	 */
	scriptLattesDiff.paginas.principaisAlteracoes(
		scriptLattesDiff.datasProcessamento[0],   // data inicial
		scriptLattesDiff.datasProcessamento.end() // data final
	);





	$('#escolhaDatas').submit(function(e) {
		// obtendo os valores das datas
		var jDatas = $('#escolhaDatas input[type="date"]');
		var dataInicial = scriptLattesDiff.dataProx(jDatas.eq(0).getDate());
		var dataFinal   = scriptLattesDiff.dataProx(jDatas.eq(1).getDate());



		// encontra as datas que estão em datasProcessamento
		if(dataFinal < dataInicial) {
			// swap de variaveis
			var temp = jDatas.eq(1).val();
			jDatas.eq(0).val(jDatas.eq(1).val());
			jDatas.eq(1).val(temp);


			temp = dataInicial;
			dataInicial = dataFinal;
			dataFinal = temp;
		}


		// após o ajuste de periodos
		scriptLattesDiff.paginas.principaisAlteracoes(dataInicial, dataFinal);

		// para não recarregar a página
		return false;
	});


	////////////////////////////////
	// adicionando filtros Amplos //
	////////////////////////////////
	// Filtros amplos são do time nomeFiltrosAmplo
	var filtroAmplo = $('#filtrosAmplos .filtro');
	var nomeFiltrosAmplo = {
		'+': 'Exibir acrescidos',
		'-': 'Exibir removidos',
		'~': 'Exibir alterados',
		//'>': 'Somente movidos',
	};
	var jFiltroAmplo = $('#filtrosAmplos .filtro').cloneAndRemove();
	// adicionando os filtros amplos, cada um para cada sinal
	$.each(nomeFiltrosAmplo, function(sinal, nomeFiltro) {
		var newFiltroAmplo = jFiltroAmplo.clone();
		newFiltroAmplo.find('span').text(nomeFiltro);
		newFiltroAmplo.find('input').attr('data-sinal', sinal);
		newFiltroAmplo.appendTo('#filtrosAmplos');
	});

	// gostei de começar desmarcando o filtro colaboradores logo de início
	Filtro.uncheck('colaboradores');

	// define todos os perfis de filtros
	Filtro.setPerfis(Object.keys(Filtro.getLocalStorage()));



	//----------------------------------------------------
	// Trabalhando com o botão Run
	//----------------------------------------------------
	
	// decisão de esconder o botão Run que roda novamente a iniciação
	// escondo ele quando não estou executando numa máquina com php
	// para testar, vamos ver o protocolo
	// se for file:/// escondo
	var isProtocoloFile = window.location.href.match(/^file:\/\/\//);
	var devoMostrarSempre = false;
	if(isProtocoloFile && !devoMostrarSempre) {
		// devo esconder o botão
		$('.botaoRun').hide();
	}
	else {
		// vamos definir qual o comando que será executado assim que o botão for chamado
		$('.botaoRun').click(function(e) {


			var msgAguardo = 'Sua requisição foi enviada, por favor, aguarde enquanto a aplicação é executada.<br>'+
			'O processo demora alguns minutos, por favor aguarde. Enquanto isso, navegue na internet, isso não irá interferir no tempo de espera.<br>'+
			'Executando';
			$(document.body).html(msgAguardo);
			
			// de tempos em tempos, vamos colocar uns pontinhos nessa msg
			var i = 1;
			var maxPontos = 10;
			var msgInterval = setInterval(function() {
				var pontosFinais = '.'.repeat(i);

				$(document.body).html(msgAguardo+'<b>'+pontosFinais+'</b>');
				
				i = (i+1) % (maxPontos + 1);
			}, 1000);
			

			// faço um get no arquivo php/novoArquivo.php
			if(!devoMostrarSempre) {

				var novoArquivoPhp = '/php/novoArquivo.php';
				var onSuccess = function(data) {
					// atualiza a página
					window.location.reload();
				};
				var onFail = function (data) {
					clearInterval(msgInterval);
					alert('Desculpe, um erro ocorreu enquanto a aplicação trabalhava');
					window.location.reload();
				}


				// faz a requisão do novo arquivo para o servidor http
				$.ajax(novoArquivoPhp).done(onSuccess).fail(onFail);
			}

		});
	}



	
}