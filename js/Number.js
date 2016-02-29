/**
 * Funções que implementarão a biblioteca Date
 */





Number.prototype.fillZero = function(length) {
	length = length || 2;
	var leftZeros = length - this.toString().length;
	var i;
	var result = '';
	for(var i=0; i<leftZeros; i++) {
		result += '0';
	}
	return result+this.toString();
}