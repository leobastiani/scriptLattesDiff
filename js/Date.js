/**
 * Funções que implementarão a biblioteca Date
 */







/**
 * Transforma a string recebida do scriptLattes em Date
 * @param  {String} str 01/01/1970 12:00:00
 * @return {Date}
 */
Date.parseScriptLattes = function(str) {
	// se não bater a string desse jeito, retorna erro
	if(!str.match(/^\d{2}\/\d{2}\/\d{4} \d{2}\:\d{2}\:\d{2}$/)) {
		throw new Error('parseScriptLattes');
	}


	// divide em data e hora
	str = str.split(' ');

	var data = str[0], hora = str[1];
	// divide a data em [dia, mes, ano]
	data = data.split('/');
	data[1] -= 1; // tem q subtrair 1 do mes, a contagem começa no 0
	// divide a hora em [hora, minuto, segundo]
	hora = hora.split(':');


	return new Date(
		data[2], data[1], data[0], hora[0], hora[1], hora[2]
	);
}







/**
 * retorna a string do tipo 01/01/1970 12:00:00
 * @return {String}
 */
Date.prototype.toStringScriptLattes = function() {
	return this.toLocaleString();
}






/**
 * será defino nos campos input type date
 * @return {String} yyyy-MM-dd
 */
Date.prototype.toValDate = function() {
	var month = this.getMonth()+1; // tem que somar um, a contagem começa no 0
	return this.getFullYear()+'-'+month.fillZero()+'-'+this.getDate().fillZero();
}