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
 * função que deve ser chamada no lugar de $(document).ready,
 * pois ela será chamada assim que todos os jsons forem carregados
 * @param  {event} e
 */
function documentReady() {

	// se não tá disponível o localStorage
	scriptLattesDiff.navegadorAtualizado(localStorage);

	console.log('Todos os arquivos foram carregados!');
	scriptLattesDiff.init();
	
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
		$('#listaDatasDisponíveis').append($('<li>').text(elem.toStringScriptLattes()));
	});
	// e nos calendários do principaisAlteracoes
	// faz a dobradinha antes
	$('.data-comparativa-grupo').after($('.data-comparativa-grupo').clone());
	var datasCalendario = [scriptLattesDiff.datasProcessamento[scriptLattesDiff.datasProcessamento.length-2], scriptLattesDiff.datasProcessamento.end()];
	$('.data-comparativa-grupo input.data').each(function(index, el) {
		$(this).val(datasCalendario[index].toValDate());
	});
	// agora coloca no combobox embaixo das datas de pesquisa
	$('.data-comparativa-grupo select.data').each(function(index, elem) {
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
			var devoMudar = $(this).parents('.data-grupo').find('input[type=date]');
			devoMudar.val($(this).val());

			// volta para o estado inicial
			$(this).val('');
		});
	});


	// preenche o select de apagar snap
	if(!scriptLattesDiff.isProtocoloFile()) {
		$.get('../php/removeSnap.php?getSnaps', function(data) {
			var snaps = data.split('\n');
			// remove o ultimo que é em branco
			snaps.pop();
			// ordena
			snaps.sort();

			snaps.forEach(function (snap, index) {
				$('#snapsList').append($('<option>').text(snap).val(snap));
			});
		});

		// adiciona o comando ao botão
		$('#btnRemoveSnap').click(function(e) {
			var snap = $('#snapsList').val();
			if(window.confirm('Deseja realmente apagar o snap "'+snap+'"?')) {
				$.post('../php/removeSnap.php', {removeSnap: snap}, function(data, textStatus, xhr) {
					alert('Concluido');
					console.log(data);
				});
			}
		});
	}






	/**
	 * cria as principais páginas do meu script
	 */
	scriptLattesDiff.paginas.principaisAlteracoes(
		datasCalendario[0], // data inicial
		datasCalendario[1]  // data final
	);





	$('#btnCompararCurriculos').click(function(e) {
		// obtendo os valores das datas
		var jDatas = $('.data-comparativa-grupo input.data');
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
	});


	////////////////////////////////
	// adicionando filtros Amplos //
	////////////////////////////////
	// Filtros amplos são do time nomeFiltrosAmplo
	var filtroAmplo = $('#filtrosAmplos .filtro');
	var jFiltroAmplo = $('#filtrosAmplos .filtro').cloneAndRemove();
	var nomeFiltrosAmplo = {
		'+': 'Exibir acrescidos',
		'-': 'Exibir removidos',
		'>': 'Exibir movidos',
		'~': 'Exibir alterados',
	};
	// adicionando os filtros amplos, cada um para cada sinal
	$.each(nomeFiltrosAmplo, function(sinal, nomeFiltro) {
		var newFiltroAmplo = jFiltroAmplo.clone();
		newFiltroAmplo.find('.text').text(nomeFiltro);
		newFiltroAmplo.find('input[type=checkbox]').attr('data-sinal', sinal);
		newFiltroAmplo.appendTo('#filtrosAmplos .filtro-grupo');
	});

	// vamos fazer a dobradinha do filtro
	var filtroPesquisador = $('.filtro-panel').clone();
	$('.filtro-panel').after(filtroPesquisador);
	filtroPesquisador.attr('data-nomeArquivo', 'scriptLattesDiff - Filtro de pesquisadores');
	filtroPesquisador.find('.panel-heading .text').text('Filtro de pesquisadores:');
	filtroPesquisador.find('.panel-body').attr('id', 'filtroDePesquisadores');
	filtroPesquisador.find('label[for=perfilSelect]').text('Perfil do filtro de pesquisadores:')

	// define todos os perfis de filtros
	var filtrosObj = [
		new Filtro('filtroPerfis', $('.perfil-select:eq(0)')),
		new Filtro('filtroPesquisadoresPerfis', $('.perfil-select:eq(1)'))
	];
	filtrosObj.forEach(function (elem, index) {
		elem.setPerfis();

		// tenta carregar os filtros da net
		if(!scriptLattesDiff.isProtocoloFile()) {
			// posso carregar
			$.post('../php/carregarPerfilFiltro.php', {perfil: elem.perfisLocalStorage}, function(data, textStatus, xhr) {
				try {
					data = JSON.parse(data);
				}
				catch(e) {
					console.log('É preciso digitar a senha para ler os filtros.');
					return ;
				}
				// agora que eu tenho os dados, vou salvar e recarregar
				elem.salvarLocalStorage(data, '', false);
				elem.setPerfis();
			});
		}
	});


	//////////////////////////////////////////
	// adicionando filtros de pesquisadores //
	//////////////////////////////////////////
	var filtroPesquisadoresGroup = $('.filtro-grupo:eq(1)');
	// vamos zerá-lo
	filtroPesquisadoresGroup.html('');
	// adiona todos os pesquisadores
	$.each(scriptLattesDiff.allIdLattes, function(index, pesquisadorId) {
		var pesquisador = scriptLattesDiff.idLattes[pesquisadorId];

		// devo adicionar um elemento ddo tipo jFiltroAmplo
		var elem = jFiltroAmplo.clone();
		var val = pesquisador.getNome();
		elem.find('.text').text(val);
		elem.find('input[type=checkbox]').val(pesquisador.getNome());
		elem.appendTo(filtroPesquisadoresGroup);
	});



	//----------------------------------------------------
	// Trabalhando com o botão Run
	//----------------------------------------------------
	
	// decisão de esconder o botão Run que roda novamente a iniciação
	// escondo ele quando não estou executando numa máquina com php
	// para testar, vamos ver o protocolo
	// se for file:/// escondo
	var devoMostrarSempre = false;
	if(scriptLattesDiff.isProtocoloFile() && !devoMostrarSempre) {
		// devo esconder o botão
		$('.botaoRun').hide();
	}



	// atualizo os filtros
	// porque eu escondo os campos acrescidos, removidos, ...
	// que não possuem nenhum elemento
	Filtro.update(false);



}