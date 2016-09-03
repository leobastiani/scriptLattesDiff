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
$.fn.filterDisplayNone = function () {
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