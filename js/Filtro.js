var Filtro = {};


Filtro.nomesReservados = ['Todos', 'Nenhum', 'Marcados'];


/**
 * Obtem o jquery do checkbox do nomeFiltro
 * também funciona se nomeFiltro for um array
 */
Filtro.getElem = function (nomeFiltro) {
	if(nomeFiltro instanceof Object) {
		// para vários filtros
		
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


	
	// esconde os pais

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
 * nome padrão do JSON que está no localStorage que possui
 * os filtros salvos pelo usuário
 * @type {String}
 */
Filtro.perfisLocalStorage = 'filtroPerfis';

/**
 * Obtem um json da forma:
 * {
 *   'nome do filtro': ['campo para mostrar 1', 'campo para mostrar 2', '...']
 * }
 */
Filtro.getLocalStorage = function () {
	var result = localStorage.getItem(Filtro.perfisLocalStorage) || '{}';
	return JSON.parse(result);
}


/**
 * Salva um json da msma forma que é obtido em Filtro.getLocalStorage()
 * e atualiza o campo de filtros
 */
Filtro.salvarLocalStorage = function (dados, novoCampo) {
	localStorage.setItem(Filtro.perfisLocalStorage, JSON.stringify(dados));
	
	Filtro.setPerfis(Object.keys(dados));

	// atualiza o valor do perfil
	novoCampo = novoCampo || 'Todos';
	Filtro.jPerfil.val(novoCampo);
}



/**
 * Retorna todos os elementos que devem ter a caixinha
 * marcada de acordo com o nome do perfil
 *
 * Se nomePerfil for Todos, retorna todos os checkbox
 * se for Nenhum, retorn um $();
 */
Filtro.getFiltrosByPerfil = function (nomePerfil) {
	// analisa primeiro os casos especiais
	if(nomePerfil == 'Todos') {
		// retorna todos os checkbox de filtros
		return $('#filtrosComuns input[type="checkbox"]');
	}
	if(nomePerfil == 'Nenhum') {
		return $();
	}
	if(nomePerfil == 'Marcados') {
		return Filtro.getFiltrosByPerfil('Todos').filter(':checked');
	}

	// fim dos casos especiais
	var filtrosSalvos = Filtro.getLocalStorage();
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
Filtro.setPerfis = function (perfis) {
	// zera o filtroSelect
	var filtroSelect = Filtro.jPerfil;
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
Filtro._carregar = function (filtrosParaMarcar) {
	var todosPerfis = Filtro.getFiltrosByPerfil('Todos');

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
Filtro.carregar = function (nomePerfil) {
	var filtrosParaMarcar = Filtro.getFiltrosByPerfil(nomePerfil);

	/**
	 * chama os filtros para serem marcados
	 */
	Filtro._carregar(filtrosParaMarcar);
}


/**
 * vou adicionar as funções dos botões de carregar, salvar e apagar
 */
$(document).ready(function() {
	// variável com o jquery do perfil de filtros
	Filtro.jPerfil = $('#filtroSelect');

	/**
	 * Função de carregar
	 */
	$('#carregarPerfilFiltro').click(function(e) {
		// obtem o nome do perfil em filtroSelect
		var nomePerfil = Filtro.jPerfil.val();
		Filtro.carregar(nomePerfil)
	});




	/**
	 * Função de salvar Filtro
	 */
	// devo garantir que existe um item em localStorage sendo um Array
	$('#salvarPerfilFiltro').click(function(e) {
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
		var filtrosSalvos = Filtro.getLocalStorage();

		// aviso de confirmação de substituição
		if(nomeNovoFiltro in filtrosSalvos) {
			if(!window.confirm('Já existe um filtro com este nome, deseja sobrescrevê-lo?')) {
				// não qro sobrescrever
				return ;
			}
		}

		// só falta salvar
		// obtenho todos os checkbox marcados
		var todosCheckboxMarcados = Filtro.getFiltrosByPerfil('Marcados');
		// vou preencher esse Array com todos os nomes dos filtros marcados
		var nomeCampos = [];
		todosCheckboxMarcados.each(function(index, elem) {
			nomeCampos.push($(elem).val());
		});
		filtrosSalvos[nomeNovoFiltro] = nomeCampos;
		Filtro.salvarLocalStorage(filtrosSalvos, nomeNovoFiltro);
	});



	/**
	 * Definindo botão de apagar
	 */
	$('#apagarPerfilFiltro').click(function(e) {
		var nomePerfil = Filtro.jPerfil.val();
		// casos especiais
		if(nomePerfil in Filtro.nomesReservados) {
			return ;
		}

		if(!window.confirm('Deseja realmente apagar o filtro "'+nomePerfil+'"?')) {
			// não quero apagar
			return ;
		}

		var filtrosSalvos = Filtro.getLocalStorage();
		delete filtrosSalvos[nomePerfil];
		Filtro.salvarLocalStorage(filtrosSalvos);
	});



});




Filtro.enableAplicar = function (enable) {
	var btn = $('#aplicarFiltroBtn');
	if(enable) {
		// habilitando
		btn.addClass('botaoChamativo').removeAttr('disabled');
	}
	else {
		// desabilitando
		btn.removeClass('botaoChamativo').attr('disabled', 'disabled');
	}
}




Filtro.todosOsCampos = ['apresentacao_trabalho', 'artigos_em_periodicos', 'artigos_em_revista', 'capitulos_livros', 'colaboradores', 'formacao_academica', 'livros_publicados', 'organizacao_evento', 'orientacao_doutorado_concluido', 'orientacao_doutorado_em_andamento', 'orientacao_especializacao_concluido', 'orientacao_iniciacao_cientifica_concluido', 'orientacao_iniciacao_cientifica_em_andamento', 'orientacao_mestrado_concluido', 'orientacao_mestrado_em_andamento', 'orientacao_outros_tipos_concluido', 'orientacao_outros_tipos_em_andamento', 'orientacao_tcc_concluido', 'orientacao_tcc_em_andamento', 'participacao_evento', 'premios_titulos', 'processo_tecnica', 'producao_artistica', 'producao_bibliografica', 'producao_tecnica', 'produto_tecnologico', 'projetos_pesquisa', 'resumo_congresso', 'resumo_expandido_congresso', 'supervisao_pos_doutorado_concluido', 'supervisao_pos_doutorado_em_andamento', 'texto_em_jornal', 'trabalho_completo_congresso', 'trabalhos_tecnicos'];