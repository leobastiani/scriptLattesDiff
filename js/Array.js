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
Array.prototype.unique =
// http://stackoverflow.com/a/12551652/6591204
  function() {
    var a = [];
    var l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        // If this[i] is found later in the array
        if (this[i] === this[j])
          j = ++i;
      }
      a.push(this[i]);
    }
    return a;
  };

// se o elemento não for um array, transforma-o em array
// jQuery são quase um array também
Array.force = function (elem) {
	if(elem instanceof Array || elem instanceof jQuery) {
		return elem;
	}

	return [elem];
}