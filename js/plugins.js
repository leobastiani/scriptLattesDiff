var activeScreen = function (xs) {
	var possiveis = ['xs', 'sm', 'md', 'lg'];
	if(!$.inArray(xs, possiveis)) {
		return false;
	}

	var indexXs = possiveis.indexOf(xs);
	// exemplo: verificando 0
	// o index que eu estou
	var indexEstou;
	for(var i=0; i<possiveis.length; i++) {
		var elem = possiveis[i];
		if($('.visible-'+elem+':first').is(':visible')) {
			indexEstou = i;
			break;
		}
	}

	// se o index que procuro está contido no index que estou
	return indexXs <= indexEstou;
}

$(window).on('load resize', function(e) {
	// plugin do col-center
	$('.col-xs-center, .col-sm-center, .col-md-center, .col-lg-center').each(function(index, elem) {
		var col = $(elem);
		var xs = col.attr('class').match(/col-(\w+)-center/)[1];
		if(!activeScreen(xs)) {
			// se o meu elemento não está visivel
			col.css('margin-top', '');
			return ;
		}


		var row = $(elem).parents('.row');

		var tamahoExterno = row.innerHeight();
		var tamanhoComp = col.outerHeight();

		var margem = (tamahoExterno - tamanhoComp) / 2;

		col.css('margin-top', margem);
	});




	// plugin de center-horizontal
	$('.center-horizontal').each(function(index, elem) {
		var div = $(elem);

		var tamanhoDiv = div.outerWidth();
		var tamanhoWindow = $(window).width();

		if(tamanhoDiv > tamanhoWindow) {
			// a div é maior do q a window
			return ;
		}

		// colocando ela no meio
		var dif = tamanhoWindow - tamanhoDiv;

		div.css('margin-left', dif/2);
	});
});