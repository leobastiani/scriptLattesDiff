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
});