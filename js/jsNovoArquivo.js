$(document).ready(function() {
	$(window).resize(function(e) {
		// na vertical
		var formListHeight = $('#formList').outerHeight();
		var diffHeight = formListHeight - $('#formList > textarea').outerHeight();
		$('#formList > textarea').outerHeight(
			// no final, subtrai pela margem em cima e em baixo
			$(window).height()-diffHeight-$('#formList').offset().top*2
		);

		// na horizontal
		$('#formList > textarea').outerWidth(
			// no final, subtrai pela margem em cima e em baixo
			$(window).width()-$('#formList').offset().left*2
		);
	});


	// chama o resize uma vez
	$(window).resize();

	// obtem o arquivo de lista
	$.post('?', {lista: true}, function(data) {
		console.log(data);
		$('#arquivoList').text(data);
	});
});



var validate = function () {
	var text = $('#arquivoList').val();
	text = $.trim(text);
	if(text === '') {
		return false;
	}
	// quebro todas as linhas
	var linhas = text.split('\n');
	var reMatch = /^(\d{16})\s*,?\s*(.+?)$/;
	try {
		linhas.forEach(function (linha, index) {
			if(!linha.match(reMatch)) {
				alert('A lista não está nos padrões do scriptLattes.\nO padrão a ser seguido é:\n{ID_LATTES} Vírgula {Nome}');
				throw null;
			}

			linhas[index] = linha.replace(reMatch, '$1 , $2');

		});

	} catch(e) {
		return false;
	}

	$('#arquivoList').val(linhas.join('\n')+'\n');
	return true;
}