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
 * Funcao que carrega um arquivo .js na página
 * @param  {String} filename nome do arquivo para ser carregado
 * @param  {Func  } onload   função que é chamada assim que a página é carregada
 */
function loadJs(filename, onload) {
	console.log('Carregando arquivo: '+filename);
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', filename);
	script.onload = onload || null;
	document.getElementsByTagName('head')[0].appendChild(script);
}
// quantidade de arquivos carregados até o momento
loadJs.filesLoaded = 0;





/**
 * json com as informações obtidas do scriptLattesDiff
 * @type {dicionário}
 */
var scriptLattesDiff = {

	/**
	 * Nesta variável vai um dicionário com todos os pesquisadores como chaves e suas informações como valores
	 * seus valores são obtidos pelo python e escritos no final do arquivo pelo scriptLattesDiff
	 * @type {dicionário}
	 */
	idLattes: {},

	/**
	 * Um vetor com todos os idLattes que estarão presentes na variaável idLattes
	 * @type {Array}
	 */
	allIdLattes: new Array(),

	/**
	 * nome do grupo que vem do configFile mais recente
	 * @type {String}
	 */
	nomeDoGrupo: new String()
};







/**
 * função que deve ser chamada no lugar de $(document).ready,
 * pois ela será chamada assim que todos os jsons forem carregados
 * @param  {event} e
 */
function documentReady() {
	
}









$(document).ready(function() {
	// carregará todos os arquivos jsons e em seguida chamará a função documentReady
	/**
	 * função que é chamada toda vez que um arquivo for carregado em loadJs
	 * @param  {Func} event
	 */
	var onJsLoad = function () {
		loadJs.filesLoaded++; // +1, um novo arquivo foi carregado
		Carregando.step();

		if(loadJs.filesLoaded == scriptLattesDiff.allIdLattes.length) {
			// se todos os aruqivos idLattes foram carregados
			// chama a função documentReady
			console.log('Todos os idLattes foram carregados.');

			/**
			 * converte todos os idLattes para o objeto idLattes
			 */
			var i;
			for(var i in scriptLattesDiff.idLattes) {
				scriptLattesDiff.idLattes[i] = new Pesquisador(i, scriptLattesDiff.idLattes[i]);
			}



			/**
			 * convertendo as datas no objeto de Date
			 */
			scriptLattesDiff.datasProcessamento.forEach(function (elem, index) {
				scriptLattesDiff.datasProcessamento[index] = Date.parseScriptLattes(elem);
			});


			// assim que todos já foram carregados, carrega o scriptLattesDiff
			loadJs('../js/scriptLattesDiff.js', documentReady);
		}
	}







	// carregando allIdLattes
	var onLoadAllIdLattes = function () {
		console.log('Variável allIdLattes carregada:', scriptLattesDiff.allIdLattes);

		/**
		 * Iniciar a tela de carregando
		 */
		var lenPesquisadores = scriptLattesDiff.allIdLattes.length;
		// mais um porque vou dar um step dentro da função
		// scriptLattesDiff.init()
		Carregando.start(lenPesquisadores);

		// cria o dicionário idLattes em scriptLattesDiff
		// ele possuirá todos os pesquisadores do tipo
		// new Pesquisador
		scriptLattesDiff.idLattes = {};

		// instrução para carregar todos os idLattes
		scriptLattesDiff.allIdLattes.forEach(function (elem, index) {
			// carrega arquivo por arquivo dos pesquisadores
			loadJs('../json/idLattes/'+elem+'.js', onJsLoad);
		});
	}







	loadJs('../json/scriptLattesDiff.js', onLoadAllIdLattes);

	// primeiros passos para a tela de carregando
	Carregando.init('Baixando...');

});