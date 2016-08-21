<?php
include_once "showErrors.php";
include_once "execmd.php";


if (isset($_POST['lista'])) {
	// obtendo o path do arquivo de lista
	$getListString = execScriptLattesDiff("-na --get-list");
	$getListLines = explode("\n", $getListString);
	$getList = end($getListLines);
	// lendo o arquivo de lista
	if (!file_exists($getList)) {
		// o arquivo não existe
		echo $getListString;
		exit();
	}
	$readList = file_get_contents($getList);

	echo $readList;
	exit();
}
?>


<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>ScriptLattesDiff - Novo snap</title>
	<!-- <link rel="stylesheet" href=""> -->

	<!-- Jquery é a primeira biblioteca que deve ser carregada -->
	<script src="../vendor/jquery.js"></script>

</head>
<body>

<?php
if ($_POST == []) {
?>


	<!-- caso em que vou mostrar o formulário -->
	<form method="post" id="formList" onsubmit="return validate();">
		<script src="../js/jsNovoArquivo.js"></script>
		Arquivo de lista mais recente:<br/>
		<textarea name="arquivoList" id="arquivoList">Aguarde</textarea>
		<br/>
		<input type="submit" value="Enviar" style="font-size: 1.4em">
	</form>


<!-- fim do caso em que devo exibir o html -->
<?php
} else {

	// tratando o conteudo
	$content = $_POST['arquivoList'];
	$content = str_replace("\r\n", "\n", $content);
	$content = trim($content)."\n";


	if (isset($_POST['ajax'])) {
		// caso eu tenha feito uma requisição ajax
		
		// Ignore user aborts and allow the script
		// to run forever
		ignore_user_abort(true);
		set_time_limit(0);

		// para o comando abaixo funcionar
		// use chmod 777 . -R
		// na pasta do ScriptLattesDiff
		$arquivo = fopen("tmp", "w");
		fwrite($arquivo, $content);
		fclose($arquivo);
		$cmdOutput = execScriptLattesDiff("-na -list tmp -y");
		unlink("tmp");

		// salvando
		echo $cmdOutput;
		$arquivo = fopen("saida.txt", "w");
		fwrite($arquivo, $cmdOutput);
		fclose($arquivo);
	}
	else {
		?>

		Sua requisição foi enviada.<br/>
		O processo demora alguns minutos ou horas.<br/>
		Sinta-se à vontade para navegar na internet, isso não irá interferir no tempo de espera.<br/>
		Pode desligar este computador e voltar mais tarde, caso desejar.<br/>
		<img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="Carregando...">


		<script>
			// vou fazer uma requisição ajax para esta mesma página
			var listaContent = '<?php echo str_replace("\n", "\\n", $content); ?>';
			$.post('?', {ajax: true, arquivoList: listaContent }, function(data) {
				// terminado de carregar
				console.log(data);
				window.location.href = "../html/index.htm";
			});
		</script>

		<?php
	}
}
?>
</body>
</html>