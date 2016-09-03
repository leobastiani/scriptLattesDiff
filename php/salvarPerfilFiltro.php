<?php
include_once "showErrors.php";
include_once "checkPassword.php";


if (!isset($_POST['perfil']) or !isset($_POST['dados'])) {
	// não há oq ser feito
	exit();
}


$perfil = $_POST['perfil'];
$dados = $_POST['dados'];

// perfil deve ser de algum tipo bem definido
$perfisPossiveis = ['filtroPerfis', 'filtroPesquisadoresPerfis'];

if (!in_array($perfil, $perfisPossiveis)) {
	// é alguem tentando salvar um perfil que não é possível
	exit();
}


// entra na pasta correta
$dest = '../cookies';
if (!file_exists($dest)) {
	mkdir($dest);
}
chdir($dest);


// agora eu salvo
$fp = fopen($perfil, 'w');
fwrite($fp, $dados);
fclose($fp);

echo 'Perfil salvo com sucesso';

?>