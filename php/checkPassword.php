<?php
include_once "showErrors.php";

session_start();
if (!isset($_SESSION['authorize'])) {
	// se não tem a senha, pede pra digitar
	header("Location: digitarSenha.php");
}

?>