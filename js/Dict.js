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
    var novoX = Dict.clone(x);
    var novoY = Dict.clone(y);
    novoX['autores'] = novoX['autores'].replace(' ; ', '. ');
    novoY['autores'] = novoY['autores'].replace(' ; ', '. ');
    return Dict._equals(novoX, novoY);
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