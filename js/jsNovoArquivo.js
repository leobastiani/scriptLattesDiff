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
$(document).ready(function() {
	$(window).resize(function(e) {
		// na vertical
		var formListHeight = $('#formList').outerHeight();
		var diffHeight = formListHeight - $('#formList > textarea').outerHeight();
		$('#formList > textarea').outerHeight(
			// no final, subtrai pela margem em cima e em baixo
			$(window).height()-diffHeight-$('#formList').offset().top*2
		);

		// na horizontal
		$('#formList > textarea').outerWidth(
			// no final, subtrai pela margem em cima e em baixo
			$(window).width()-$('#formList').offset().left*2
		);
	});


	// chama o resize uma vez
	$(window).resize();

	// obtem o arquivo de lista
	$.post('?', {lista: true}, function(data) {
		console.log(data);
		$('#arquivoList').text(data);
	});
});



var validate = function () {
	var text = $('#arquivoList').val();
	text = $.trim(text);
	if(text === '') {
		return false;
	}
	// quebro todas as linhas
	var linhas = text.split('\n');
	var reMatch = /^(\d{16})\s*,?\s*(.+?)$/;
	try {
		linhas.forEach(function (linha, index) {
			if(!linha.match(reMatch)) {
				throw null;
			}

			linhas[index] = linha.replace(reMatch, '$1 , $2');

		});

	} catch(e) {
		alert('A lista não está nos padrões do scriptLattes.\nO padrão a ser seguido é:\n{ID_LATTES} Vírgula {Nome}');
		return false;
	}


	linhas = linhas.unique().sort(function (a, b) {
		var nomeA = a.match(reMatch)[2];
		var nomeB = b.match(reMatch)[2];

		if(nomeA < nomeB) {
			return -1;
		} else if(nomeA > nomeB) {
			return 1;
		} else {
			return 0;
		}

	});

	$('#arquivoList').val(linhas.join('\n')+'\n');
	return true;
}