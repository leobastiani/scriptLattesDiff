/**
 * Funções que implementarão a biblioteca Array
 */








/**
 * Adiciona um elemento ao array caso ele não exista
 * @return {bool}
 */
Array.prototype.pushUnique = function(elem) {

	if($.inArray(elem, this) != -1) {
		// elemento já está no array
		return false;
	}

	this.push(elem);
	return true;
}






/**
 * devolve o último elemento do array
 */
Array.prototype.end = function() {
	return this.slice(-1)[0];
}



/**
 * Deixa o Array só com elementos únicos
 */
Array.prototype.unique = function () {
	return $.unique(this);
}

// se o elemento não for um array, transforma-o em array
// jQuery são quase um array também
Array.force = function (elem) {
	if(elem instanceof Array || elem instanceof jQuery) {
		return elem;
	}

	return [elem];
}