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
 * Arquivo que trata dicionários para o scriptLattesDiff
 */

Dict = {};




/**
 * Clona um dicionário com filhos + e -
 * @param  {Dict} dict Dicionário para ser clonado
 * @return {Dict}
 */
Dict.clone = function (dict) {
	return $.extend(true, {}, dict);
}




/**
 * Função que compara dois dicionários
 * retorna true or false
 */
Dict.equals = function (x, y, campo) {

  if(Dict.soAutoresBug(x) && Dict.soAutoresBug(y)) {
    // tem autores, faço aquele macete
    var novoX = x['autores'].replace(' ; ', '. ').replace('?', ' ');
    var novoY = y['autores'].replace(' ; ', '. ').replace('?', ' ');
    return novoX == novoY;
  }

  return Dict._equals(x, y);
}


/**
 * um bug que acontece o seguinte: exemplo
 * {
 *   ano: 0
 *   autores: 'toda a string'
 *   titulo: '' // todas as outras ficam vazias
 * }
 */
Dict.soAutoresBug = function (x) {

  if(!('autores' in x)) {
    // se autores não estiver em x
    return false;
  }

  for(campo in x) {
    if(campo == 'ano') {
      if(x[campo] != '0') {
        // se o campo for ano, tem q ser zero
        return false;
      }
    }

    else if(campo != 'autores') {
      if(x[campo] != '') {
        return false;
      }
    }
  }
  // passei nos teste
  return true;
}


Dict._equals = function(x, y) {
  var camposImportantes = ['titulo', 'nome', 'descricao', 'titulo_trabalho'];
  // testa primeiro os campos importantes
  for(var i=0; i<camposImportantes.length; i++) {
    var campo = camposImportantes[i];

    if(campo in x) {
      if(x[campo] == '' && y[campo] == '') {
        // os dois são vazios, não posso me basear nisso
        continue;
      }

      // não são vazios
      return x[campo] == y[campo];
    }
  }

	
  // testa campo por campo
  for(var campo in x) {
    if(campo in ['ano', 'autores']) {
      // não testa o ano e autores
      continue;
    }

    if(x[campo] != y[campo]) {
      // se eles forem diferentes
      return false;
    }
  }
  return true;
}