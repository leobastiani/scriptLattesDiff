<?php

$arquivoRun = '../run.sh';

if (file_exists($arquivoRun)) {
	$message = shell_exec("bash ../run.sh");
	print_r($message);
}


else {
	// imprime para o usuário que não foi encontrado o arquivo
	
	echo 'Por favor, crie um arquivo "'+$arquivoRun+'" que executa o scriptLattesDiff com a opção --novo-arquivo.';

}

?>