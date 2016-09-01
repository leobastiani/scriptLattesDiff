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
		$('#datasProcessamento ul').append($('<li>').text(elem.toStringScriptLattes()));
	});
	// e nos calendários do principaisAlteracoes
	var datasCalendario = [scriptLattesDiff.datasProcessamento[scriptLattesDiff.datasProcessamento.length-2], scriptLattesDiff.datasProcessamento.end()];
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
		scriptLattesDiff.datasProcessamento[scriptLattesDiff.datasProcessamento.length-2], // data inicial
		scriptLattesDiff.datasProcessamento.end()                                          // data final
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
		newFiltroAmplo.find('span').text(nomeFiltro);
		newFiltroAmplo.find('input').attr('data-sinal', sinal);
		newFiltroAmplo.appendTo('#filtrosAmplos');
	});

	// define todos os perfis de filtros
	var filtrosObj = [
		new Filtro('filtroPerfis', $('#filtroSelect')),
		new Filtro('filtroPesquisadoresPerfis', $('#filtroPesquisadoresSelect'))
	];
	filtrosObj.forEach(function (elem, index) {
		elem.setPerfis();

		// tenta carregar os filtros da net
		if(!scriptLattesDiff.isProtocoloFile()) {
			// posso carregar
			$.post('../php/carregarPerfilFiltro.php', {perfil: elem.perfisLocalStorage}, function(data, textStatus, xhr) {
				data = JSON.parse(data);
				// agora que eu tenho os dados, vou salvar e recarregar
				elem.salvarLocalStorage(data, '', false);
				elem.setPerfis();
			});
		}
	});


	//////////////////////////////////////////
	// adicionando filtros de pesquisadores //
	//////////////////////////////////////////
	var filtrosPesquisadores = $('#filtrosPesquisadores');
	$.each(scriptLattesDiff.allIdLattes, function(index, pesquisadorId) {
		var pesquisador = scriptLattesDiff.idLattes[pesquisadorId];

		// devo adicionar um elemento ddo tipo jFiltroAmplo
		var elem = jFiltroAmplo.clone();
		var val = pesquisador.getNome();
		elem.find('span').text(val);
		elem.find('input').val(pesquisador.getNome());
		elem.appendTo(filtrosPesquisadores);
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