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