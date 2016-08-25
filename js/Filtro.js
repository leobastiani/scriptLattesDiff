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
var Filtro = function(perfisLocalStorage, jPerfil) {
	/**
	 * nome padrão do JSON que está no localStorage que possui
	 * os filtros salvos pelo usuário
	 * @type {String}
	 */
	this.perfisLocalStorage = perfisLocalStorage;

	// variável com o jquery do perfil de filtros
	this.jPerfil = jPerfil;

	// div que engloba todos os elementos do filtro
	this.jTipoFiltro = jPerfil.parents('.tipoFiltro');

	// definindo o ponteiro no elemento html
	this.jTipoFiltro.data('filtro', this);


	// vamos adicionar funções ao document.ready
	var self = this;

	/**
	 * vou adicionar as funções dos botões de carregar, salvar e apagar
	 */
	$(document).ready(function() {

		/**
		 * Função de carregar
		 */
		self.jTipoFiltro.find('#carregarPerfilFiltro').click(function(e) {
			// obtem o nome do perfil em filtroSelect
			var nomePerfil = self.jPerfil.val();
			self.carregar(nomePerfil);
		});




		/**
		 * Função de salvar Filtro
		 */
		// devo garantir que existe um item em localStorage sendo um Array
		self.jTipoFiltro.find('#salvarPerfilFiltro').click(function(e) {
			// vão ser armazenados desse jeito
			// {
			//   'nome do filtro': ['campo1', 'campo2', ...]
			// }
			
			var nomeNovoFiltro = window.prompt('Digite o nome do filtro que você deseja salvar');
			if(!nomeNovoFiltro) {
				return ;
			}
			// analisa os casos especiais
			if(nomeNovoFiltro in Filtro.nomesReservados) {
				alert('Este nome é reservado. Por favor, insira outro nome.');
				return ;
			}
			// pega todos os filtros salvos
			// por padrão é {}
			var filtrosSalvos = self.getLocalStorage();

			// aviso de confirmação de substituição
			if(nomeNovoFiltro in filtrosSalvos) {
				if(!window.confirm('Já existe um filtro com este nome, deseja sobrescrevê-lo?')) {
					// não qro sobrescrever
					return ;
				}
			}

			// só falta salvar
			// obtenho todos os checkbox marcados
			var todosCheckboxMarcados = self.getFiltrosByPerfil('Marcados');
			// vou preencher esse Array com todos os nomes dos filtros marcados
			var nomeCampos = [];
			todosCheckboxMarcados.each(function(index, elem) {
				nomeCampos.push($(elem).val());
			});
			filtrosSalvos[nomeNovoFiltro] = nomeCampos;
			self.salvarLocalStorage(filtrosSalvos, nomeNovoFiltro);
		});



		/**
		 * Definindo botão de apagar
		 */
		self.jTipoFiltro.find('#apagarPerfilFiltro').click(function(e) {
			var nomePerfil = self.jPerfil.val();
			// casos especiais
			if(nomePerfil in Filtro.nomesReservados) {
				return ;
			}

			if(!window.confirm('Deseja realmente apagar o filtro "'+nomePerfil+'"?')) {
				// não quero apagar
				return ;
			}

			var filtrosSalvos = self.getLocalStorage();
			delete filtrosSalvos[nomePerfil];
			self.salvarLocalStorage(filtrosSalvos);
		});

	}); // fim do ready


};


Filtro.nomesReservados = ['Todos', 'Nenhum', 'Marcados'];


/**
 * Obtem o jquery do checkbox do nomeFiltro
 * também funciona se nomeFiltro for um array
 */
Filtro.getElem = function (nomeFiltro) {
	if(nomeFiltro instanceof Object) {
		// para vários filtros
		// se nomeFiltro for um array
		
		var result = $();
		$.each(nomeFiltro, function(index, elem) {
			result = result.add(Filtro.getElem(elem));
		});

		return result;
	}

	// para um único filtro
	return $('.filtro > input[value="'+nomeFiltro+'"]');
}





/**
 * Quando mudo o valor de um filtro
 * devo chamar a função de update
 */
Filtro.onchange = function(e) {
	// antes eu dava um update, agr só dou um update dps q clicar em aplicar
	// Filtro.update();

	// devo habilitar o botão de aplicar
	Filtro.enableAplicar(true);
}



/**
 * Retorna o sinal do tipo +, -, ~, >
 * com base num elemento .tabelaAlterados
 */
Filtro.getSinalTabelaAlterados = function (elem) {
	var tabelaClasse = {
		'+': '.acrescidos',
		'-': '.removidos',
		'~': '.alterados',
		'>': '.movidos',
	};
	var result = '';
	$.each(tabelaClasse, function(sinal, classe) {
		if(elem.is(classe)) {
			result = sinal;
			return false;
		}
	});
	return result;
}



/**
 * Sempre que uma alteração nos filtros é feita, essa função deve ser chamada
 * para que as devidas divs devam ser mostradas
 */
Filtro.update = function (showConcluidoMessage) {
	// sete para true e no final de update, veja um Concluido na tela
	showConcluidoMessage = typeof showConcluidoMessage == 'undefined' ? true : showConcluidoMessage;
	console.log('Atulizando os filtros que devem ser mostrados.');


	// essa função funciona da seguinte maneira
	// coloque .filtro-invisivel nas divs que queremos esconder
	// só de fazer isso, as divs pais tmb são escondidas

	// mostra todo mundo
	$('.filtro-invisivel').removeClass('filtro-invisivel');

	// esconde os campos
	var filtrosComunsEsconder = $('#filtrosComuns .filtro').filter(function(index) {
		return !$(this).find('input[type=checkbox]').prop('checked');
	});

	filtrosComunsEsconder.each(function(index, filtro) {
		// esconde o pai do campo correspondente
		$('*[data-campo="'+$.trim($(filtro).text())+'"]').parent().addClass('filtro-invisivel');
	});



	// esconde os filtros amplos
	var filtrosAmplosEsconder = $('#filtrosAmplos .filtro').filter(function(index) {
		return !$(this).find('input[type=checkbox]').prop('checked');
	});

	filtrosAmplosEsconder.each(function(index, filtro) {
		var tabelaEsconder = $('.tabelaAlterados').filter(scriptLattesDiff.paginas.getClassBySinal($(filtro).find('input').attr('data-sinal')));
		tabelaEsconder.addClass('filtro-invisivel');
	});

	// esconde o grupo de pesquisadores
	var filtrosPesquisadoresEsconder = $('#filtrosPesquisadores .filtro').filter(function(index) {
		return !$(this).find('input[type=checkbox]').prop('checked');
	});
	// vamos converter para string
	var filtrosPesquisadoresEsconderStr = filtrosPesquisadoresEsconder.map(function(index, elem) {
		return $(elem).find('span').text();
	});
	// vamos testar todos os membros
	// se o nome deles estiver em filtrosPesquisadoresEsconderStr, vamos escondelo
	$('.membro').each(function(index, membro) {
		var nome = $.trim($(membro).find('.nome').text());
		if($.inArray(nome, filtrosPesquisadoresEsconderStr) != -1) {
			// já que está no filtro, vamos escondê-lo
			$(membro).addClass('filtro-invisivel');
		}
	});
	



	/////////////////////
	// esconde os pais //
	/////////////////////

	// começando pela tebelaAlterados
	$('.tabelaAlterados').filter(function(index) {
		// essa tabela alterados deve ter todos os camposAlterados invisiveis
		var camposAlteradosVisiveis = $(this).find('.campoAlterado:not(.filtro-invisivel)');
		// se eu quero esconder
		// não pode ter nenhum visivel
		return camposAlteradosVisiveis.length == 0;
	}).addClass('filtro-invisivel');

	// esconde membro
	$('.membro').filter(function(index) {
		// esse membro não pode ter nenhum tabelaAlterados visivel
		var tabelaAlteradosVisivel = $(this).find('.tabelaAlterados:not(.filtro-invisivel)');
		// se eu quero esconder
		// não pode ter nenhum visivel
		return tabelaAlteradosVisivel.length == 0;
	}).addClass('filtro-invisivel');



	// adicionando listras cinzas
	// remove de todos
	$('.listraCinza').removeClass('listraCinza');
	// adiciona apenas nos pares
	$('.campoAlterado:visible').filter(':even').addClass('listraCinza');


	// vamos desabilitar o botão aplicar
	Filtro.enableAplicar(false);
	
	if(showConcluidoMessage) {
		alert('Concluido');
	}
}


/**
 * desmarca a caixa de um filtro
 * se doUpdate for true, ele chama a função Filtro.update()
 * doUpdate por padrão é true
 */
Filtro.uncheck = function (nomeFiltro, doUpdate) {
	// transforma nomeFiltro em Array
	nomeFiltro = Array.force(nomeFiltro);
	var len = nomeFiltro.length;

	for(var i=0; i<len; i++) {
		var elem = Filtro.getElem(nomeFiltro[i]);
		if(elem.prop('checked') != false) {
			elem.prop('checked', false);
		}
	}

	// diz se devo atualizar as divs com show ou hide
	doUpdate = typeof(doUpdate) === 'undefined' ? true : false;
	if(doUpdate) {
		Filtro.update();
	}


}


/**
 * ativa o filtro
 * se doUpdate for true, ele chama a função Filtro.update()
 * doUpdate por padrão é true
 */
Filtro.check = function (nomeFiltro, doUpdate) {
	// transforma nomeFiltro em Array
	nomeFiltro = Array.force(nomeFiltro);
	var len = nomeFiltro.length;

	for(var i=0; i<len; i++) {
		var elem = Filtro.getElem(nomeFiltro[i]);
		if(elem.prop('checked') != true) {
			elem.prop('checked', true);
		}
	}

	// diz se devo atualizar as divs com show ou hide
	doUpdate = typeof(doUpdate) === 'undefined' ? true : false;
	if(doUpdate) {
		Filtro.update();
	}


}


/**
 * Inverte o filtro nomeFiltro
 * se o filtro está checked, ele fica unchecked
 * e vice-versa
 * se doUpdate for true, ele chama a função Filtro.update()
 * doUpdate por padrão é true
 */
Filtro.toggle = function (nomeFiltro, doUpdate) {
	// transforma nomeFiltro em Array
	nomeFiltro = Array.force(nomeFiltro);
	var len = nomeFiltro.length;

	for(var i=0; i<len; i++) {
		// inverte a caixinha
		Filtro.getElem(nomeFiltro[i]).prop('checked', function (i, value) {
			return !value;
		});
	}

	// diz se devo atualizar as divs com show ou hide
	doUpdate = typeof(doUpdate) === 'undefined' ? true : false;
	if(doUpdate) {
		Filtro.update();
	}
}


/**
 * Obtem um json da forma:
 * {
 *   'nome do filtro': ['campo para mostrar 1', 'campo para mostrar 2', '...']
 * }
 */
Filtro.prototype.getLocalStorage = function () {
	var result = localStorage.getItem(this.perfisLocalStorage) || '{}';
	return JSON.parse(result);
}


/**
 * Salva um json da msma forma que é obtido em this.getLocalStorage()
 * e atualiza o campo de filtros
 */
Filtro.prototype.salvarLocalStorage = function (dados, novoCampo, salvarRemotamente) {
	if(typeof salvarRemotamente === 'undefined') {
		salvarRemotamente = true;
	}

	var jsonDados = JSON.stringify(dados);
	localStorage.setItem(this.perfisLocalStorage, jsonDados);
	
	this.setPerfis(Object.keys(dados));

	// atualiza o valor do perfil
	novoCampo = novoCampo || 'Todos';
	this.jPerfil.val(novoCampo);

	// salva no servidor remotamente
	if(!scriptLattesDiff.isProtocoloFile() && salvarRemotamente) {
		// envia via ajax uma requisição
		var postRequest = {'perfil': this.perfisLocalStorage, 'dados': jsonDados};
		$.post('../php/salvarPerfilFiltro.php', postRequest, function(data, textStatus, xhr) {
			console.log('Filtro salvo com sucesso: ', postRequest);
			console.log(data);
		});
	}

}



/**
 * Retorna todos os elementos que devem ter a caixinha
 * marcada de acordo com o nome do perfil
 *
 * Se nomePerfil for Todos, retorna todos os checkbox
 * se for Nenhum, retorn um $();
 */
Filtro.prototype.getFiltrosByPerfil = function (nomePerfil) {
	// analisa primeiro os casos especiais
	if(nomePerfil == 'Todos') {
		// retorna todos os checkbox de filtros
		return this.jTipoFiltro.find('.filtros').find('input[type="checkbox"]');
	}
	if(nomePerfil == 'Nenhum') {
		return $();
	}
	if(nomePerfil == 'Marcados') {
		return this.getFiltrosByPerfil('Todos').filter(':checked');
	}

	// fim dos casos especiais
	var filtrosSalvos = this.getLocalStorage();
	if(!(nomePerfil in filtrosSalvos)) {
		// não encontrei esse perfil
		throw new Error('getFiltrosByPerfil');
	}

	// apenas retorno seus elementos
	return Filtro.getElem(filtrosSalvos[nomePerfil]);
}


/**
 * altera o #filtroSelect colocando todos os perfis de filtros
 * presentes no array perfis
 */
Filtro.prototype.setPerfis = function (perfis) {
	if(typeof perfis === 'undefined') {
		perfis = Object.keys(this.getLocalStorage());
	}
	// zera o filtroSelect
	var filtroSelect = this.jPerfil;
	filtroSelect.find('option').remove();

	perfis.unshift('Todos');
	perfis.push('Nenhum');
	
	// para cada perfil novo
	for(var i=0; i<perfis.length; i++) {
		// cria um elemento option novo
		var opt = $('<option>');
		var nomeFiltro = perfis[i];
		opt.text(nomeFiltro).val(nomeFiltro);
		filtroSelect.append(opt);
	}
}



/**
 * Função auxiliar em que é passado no argumento algo como
 * [getElem('colaboradores'), getElem('doutorado_concluido'), getElem('campo3'), '...']
 * repare que são elementos de jquery
 */
Filtro.prototype._carregar = function (filtrosParaMarcar) {
	var todosPerfis = this.getFiltrosByPerfil('Todos');

	// marca os filtros que devem ser marcados
	filtrosParaMarcar.each(function(index, elem) {
		Filtro.check($(elem).val(), false);
	});
	// e desmarca os que não merecem
	todosPerfis.not(filtrosParaMarcar).each(function(index, elem) {
		Filtro.uncheck($(elem).val(), false);
	});

	// atualiza a página com um update
	Filtro.update();
}


/**
 * carrega um filtro pelo nome
 * que é uma string em localSotrage
 */
Filtro.prototype.carregar = function (nomePerfil) {
	var filtrosParaMarcar = this.getFiltrosByPerfil(nomePerfil);

	/**
	 * chama os filtros para serem marcados
	 */
	this._carregar(filtrosParaMarcar);
}




Filtro.enableAplicar = function (enable) {
	var div = $('.divBtnAplicar');
	if(enable == undefined) {
		// retorno se ele está ativo
		return div.is(':visible');
	}

	if(enable) {
		// habilitando
		div.show();
	}
	else {
		// desabilitando
		div.hide();
	}
}




Filtro.todosOsCampos = ['apresentacao_trabalho', 'artigos_em_periodicos', 'artigos_em_revista', 'capitulos_livros', 'colaboradores', 'formacao_academica', 'livros_publicados', 'organizacao_evento', 'orientacao_doutorado_concluido', 'orientacao_doutorado_em_andamento', 'orientacao_especializacao_concluido', 'orientacao_iniciacao_cientifica_concluido', 'orientacao_iniciacao_cientifica_em_andamento', 'orientacao_mestrado_concluido', 'orientacao_mestrado_em_andamento', 'orientacao_outros_tipos_concluido', 'orientacao_outros_tipos_em_andamento', 'orientacao_tcc_concluido', 'orientacao_tcc_em_andamento', 'participacao_evento', 'premios_titulos', 'processo_tecnica', 'producao_artistica', 'producao_bibliografica', 'producao_tecnica', 'produto_tecnologico', 'projetos_pesquisa', 'resumo_congresso', 'resumo_expandido_congresso', 'supervisao_pos_doutorado_concluido', 'supervisao_pos_doutorado_em_andamento', 'texto_em_jornal', 'trabalho_completo_congresso', 'trabalhos_tecnicos'];