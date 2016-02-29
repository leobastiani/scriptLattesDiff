/**
 * funções adicionais para o jQuery
 */











/**
 * text com quebra de linha
 * @param  {String} txt com \n
 * @return {jQuery}
 */
$.fn.textln = function (txt) {
	if($(this)) {
		$(this).text(txt);
		$(this).html($(this).html().replace(/\n/gm, '<br>'));
	}
	return $(this);
}






/**
 * clona um jQuery e remove ele
 * @return {jQuery}
 */
$.fn.cloneAndRemove = function () {
	var result = $(this).first().show().clone();
	$(this).remove();
	return result;
}






/**
 * diferente de :visible, essa função testa o css e diz se é diferente de none
 * @return {jQuery}
 */
$.fn.visible = function () {
	return $(this).filter(function(index) {
		return $(this).css('display') != 'none';
	});
}









/**
 * Obtem um objeto Date a partir de um input date
 */
$.fn.getDate = function () {
	var data = $(this).val().match(/(\d+)/g);
	return new Date(data[0], parseInt(data[1])-1, parseInt(data[2]));
}


/**
 * Retorna um array com todos os .val() de todos os jQuerys
 */
$.fn.vals = function () {
	return $(this).map(function(index, elem) {
		return $(elem).val();
	});
}