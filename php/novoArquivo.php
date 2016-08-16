<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Formulário de novo arquivo</title>
	<!-- <link rel="stylesheet" href=""> -->

	<!-- Jquery é a primeira biblioteca que deve ser carregada -->
	<script src="../vendor/jquery.js"></script>

</head>
<body>

<?php
include_once "execmd.php";
if ($_POST == []) {
?>


	<!-- caso em que vou mostrar o formulário -->
	<form method="post" id="formList">
		<script src="../js/jsNovoArquivo.js"></script>
		<?php
			// obtendo o path do arquivo de lista
			$getListString = execScriptLattesDiff("-na --get-list");
			$getListLines = explode("\n", $getListString);
			$getList = end($getListLines);
			// lendo o arquivo de lista
			$readList = file_get_contents($getList);
		?>
		Arquivo de lista mais recente:<br/>
		<textarea name="arquivoList"><?php echo $readList; ?></textarea>
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

		file_put_contents("tmp", $content);
		$cmdOutput = execScriptLattesDiff("-na -list tmp -y");
		unlink("tmp");
	}
	else {
		?>

		Sua requisição foi enviada, por favor, aguarde enquanto o scriptLattesDiff é executado.<br/>
		O processo demora alguns minutos. Enquanto isso, navegue na internet, isso não irá interferir no tempo de espera.<br/>
		<img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="Carregando...">


		<script>
			// vou fazer uma requisição ajax para esta mesma página
			var listaContent = '<?php echo str_replace("\n", "\\n", $content); ?>';
			$.post('?', {ajax: true, arquivoList: listaContent }, function(data) {
				// terminado de carregar
				window.location.href = "../html/index.htm";
			});
		</script>

		<?php
	}
}
?>
</body>
</html>