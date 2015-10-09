/**
 * Arquivo que trata dicionários para o scriptLattesDiff
 */

Dict = {};




/**
 * Clona um dicionário com filhos + e -
 * @param  {Dict} dict Dicionário para ser clonado
 * @return {Dict}
 */
Dict.clone = function (dict) {
	var result = {};
	for(var sinal in dict) {
		result[sinal] = Dict._clone(dict[sinal]);
	}
	return dict;
}





/**
 * clona a lista na função clone
 * @param  {Array} array Lista com Dicts ou Strings no caso de colaboradores
 * @return {Array}
 */
Dict._clone = function (array) {
	var result = new Array();
	var i;
	for(i=0; i<array.length; i++) {
		result.push(array[i]);
	}
	return result;
}