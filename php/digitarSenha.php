<?php
include_once "password.php"
session_start();

if (isset($_POST['senha'])) {
	$senha = $_POST['senha'];

	// espera 2 segundos contra ataques
	sleep(2);
	if ($senha == $password) {
		$_SESSION['authorize'] = true;
	}
}
?>

<!-- preciso digitar a senha -->
<script src="../vendor/jquery.js"></script>
<script>

$(document).ready(function() {
	var senha = window.prompt('Digite a senha', '');
	$.post('?', {senha: senha}, function(data, textStatus, xhr) {
		window.location.replace('index.php');
	});
});

</script>