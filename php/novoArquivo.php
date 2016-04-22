<?php

$arquivoRun = '../run.sh';

if (file_exists($arquivoRun)) {
	shell_exec("bash ../run.sh");
}


else {
	// imprime para o usuário que não foi encontrado o arquivo
	
	echo 'Por favor, crie um arquivo "'+$arquivoRun+'" que executa o scriptLattesDiff com a opção --novo-arquivo.';

}

?>