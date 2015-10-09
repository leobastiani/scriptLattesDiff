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
 * retorna somente os elementos pares
 * @return {jQuery}
 */
$.fn.even = function () {
	return $(this).filter(function(index) {
		return index % 2;
	});
}







$.fn.getDate = function () {
	var data = $(this).val().split('-');
	return new Date(data[0], parseInt(data[1])-1, parseInt(data[2]));
}