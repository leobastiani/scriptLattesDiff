var Carregando = {
	// vai ser uma tela inicial que ocupará toda a tela e terá a msg de carregando
	total: 1,
	carregados: 0,

	// jQuery que contém o elemento com a porcentagem
	jPorcentagemText: null,

	jFundoPreto: null,

	jDialogo: null,

	jContent: null,
};



/**
 * Função inicial para começar a tela de carregando
 * Chame ela e depois start
 */
Carregando.init = function (msg) {
	this.jFundoPreto = $('<div>').addClass('fundoPreto');
	this.jFundoPreto.appendTo(document.body);

	// já temos o fundo preto
	this.jDialogo = $('<div>').addClass('dialogoCarregando');
	this.jDialogo.appendTo(this.jFundoPreto);

	this.jContent = $('<div>').css({
		float: 'left',
		padding: '17px',
	});
	this.jContent.appendTo(this.jDialogo);

	var carregandoText = $('<h1>').text(msg).addClass('displayBlock');
	carregandoText.appendTo(this.jContent);

	var pctText = this.jPorcentagemText = $('<div>').addClass('carregandoValor');
	pctText.appendTo(this.jContent);
	// agora é só ir definindo os valores de pctText
	pctText.text('0%');
}




Carregando.reset = function () {
	this.total = 1;
	this.carregados = 0;
}


/**
 * Começa a prepara a tela de carregando
 * totalSteps é a quantidade total de step
 * para chegar no 100%
 */
Carregando.start = function (totalSteps) {
	this.reset();
	this.total = totalSteps;

	// ainda preciso ajeitar o tamanho da caixa de this.jDialogo
	this.jDialogo.outerWidth(this.jContent.outerWidth());
	this.jDialogo.outerHeight(this.jContent.outerHeight());

	// só começar a contagem agora!
}



/**
 * Essa função deve ser chamada sempre
 * que um novo passo do carregamento acontecer
 */
Carregando.step = function () {
	// conforme dou uma step
	// aumenta um carregado
	this.carregados++;

	if(this.carregados < this.total) {
		// se estou contando ainda
		var pct = this.carregados / this.total * 100;
		var pctRounded = (Math.round(pct * 100) / 100);
		var pctStr = pctRounded + '%';
		this.jPorcentagemText.text(pctStr);
	}


	else if(this.carregados == this.total) {
		// 100% carregado!!
		this.finish();
	}


}



Carregando.finish = function () {
	this.jFundoPreto.remove();
}