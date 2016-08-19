/*
 * ScriptLattesDiff
 * 
 * 
 * Copyright  (C)  2010-2016  Instituto  de  Ciências  Matemáticas  e  de
 *                            Computação - ICMC/USP
 * 
 * 
 * This program is  free software; you can redistribute  it and/or modify
 * it under the  terms of the GNU General Public  License as published by
 * the Free Software Foundation; either  version 2 of the License, or (at
 * your option) any later version.
 * 
 * This program  is distributed in the  hope that it will  be useful, but
 * WITHOUT   ANY  WARRANTY;   without  even   the  implied   warranty  of
 * MERCHANTABILITY  or FITNESS  FOR A  PARTICULAR PURPOSE.   See  the GNU
 * General Public License for more details.
 * 
 * You  should have received  a copy  of the  GNU General  Public License
 * along  with  this  program;  if   not,  write  to  the  Free  Software
 * Foundation,  Inc.,  51  Franklin   Street,  Fifth  Floor,  Boston,  MA
 * 02110-1301, USA.
 * 
 * 
 * EXCEPTION TO THE TERMS AND CONDITIONS OF GNU GENERAL PUBLIC LICENSE
 * 
 * The  LICENSE  file may  contain  an  additional  clause as  a  special
 * exception  to the  terms  and  conditions of  the  GNU General  Public
 * License. This  clause, if  present, gives you  the permission  to link
 * this  program with  certain third-part  software and  to obtain,  as a
 * result, a  work based  on this program  that can be  distributed using
 * other license than the GNU General Public License.  If you modify this
 * program, you may extend this exception to your version of the program,
 * but you  are not obligated  to do so.   If you do  not wish to  do so,
 * delete this exception statement from your version.
 * 
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

	var day = this.getDate().fillZero();
	var month = (this.getMonth()+1).fillZero();
	var year = this.getFullYear();
	var date = day+'/'+month+'/'+year;

	var hour = this.getHours().fillZero();
	var minutes = this.getMinutes().fillZero();
	var seconds = this.getSeconds().fillZero();
	var time = hour+':'+minutes+':'+seconds;

	var result = date+' '+time;
	return result;
}






/**
 * será defino nos campos input type date
 * @return {String} yyyy-MM-dd
 */
Date.prototype.toValDate = function() {
	var month = this.getMonth()+1; // tem que somar um, a contagem começa no 0
	return this.getFullYear()+'-'+month.fillZero()+'-'+this.getDate().fillZero();
}