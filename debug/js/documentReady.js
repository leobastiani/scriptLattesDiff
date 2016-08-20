$(document).ready(function() {
	


	/**
	 * preenche o conteudo de similares
	 */
	$('#similares > pre').html(var_export(Debug.similares['strSimilares'].sort(function (a, b) {
		// Compare the 2 dates
		if(a[2] < b[2]) return 1;
		if(a[2] > b[2]) return -1;
		return 0;
	}), true));
	







});