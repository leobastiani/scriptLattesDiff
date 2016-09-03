<?php
include_once "showErrors.php";
include_once "checkPassword.php";


// pasta que estão os perfis de filtros
$pasta = '../cookies';

if (!file_exists($pasta)) {
	// não há oq fazer
	exit();
}


if (!isset($_POST['perfil'])) {
	// não pedi de ngm
	exit();
}


$perfil = $_POST['perfil'];


chdir($pasta);


if (!file_exists($perfil)) {
	exit();
}



// leio o arquivo e imprimo na tela
echo file_get_contents($perfil);

?>