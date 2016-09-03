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
var Carregando = {
	// vai ser uma tela inicial que ocupará toda a tela e terá a msg de carregando
	total: 1,
	carregados: 0,

	modal: null,
};



/**
 * Função inicial para começar a tela de carregando
 * Chame ela e depois start
 */
Carregando.init = function () {
	Carregando.modal = $('#loadingModal');
	Carregando.modal.modal();
}




Carregando.reset = function () {
	Carregando.total = 1;
	Carregando.carregados = 0;
}


/**
 * Começa a prepara a tela de carregando
 * totalSteps é a quantidade total de step
 * para chegar no 100%
 */
Carregando.start = function (totalSteps) {
	Carregando.reset();
	Carregando.total = totalSteps;

	// só começar a contagem agora!
}



/**
 * Essa função deve ser chamada sempre
 * que um novo passo do carregamento acontecer
 */
Carregando.step = function () {
	// conforme dou uma step
	// aumenta um carregado
	Carregando.carregados++;

	if(Carregando.carregados <= Carregando.total) {
		// se estou contando ainda
		var pct = Carregando.carregados / Carregando.total * 100;
		var pctRounded = (Math.round(pct * 100) / 100);
		var pctStr = pctRounded + '%';
		Carregando.modal.find('.text').text(pctStr);
	}

}



Carregando.finish = function () {
	Carregando.modal.modal('hide');
}