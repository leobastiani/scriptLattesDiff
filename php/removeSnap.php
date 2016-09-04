<?php
include_once "showErrors.php";
include_once "checkPassword.php";
include_once "config.php";



if (isset($_GET['getSnaps'])) {
	if ($handle = opendir($dirSnaps)) {

	  /* Esta é a forma correta de varrer o diretório */
	  while (false !== ($file = readdir($handle))) {
	  	if ($file == '.' or $file == '..') {
	  		continue;
	  	}
	    echo "$file\n";
	  }

	  closedir($handle);
	}
}


if (isset($_POST['removeSnap'])) {
	$removeSnap = $_POST['removeSnap'];
	// vou mover essa pasta
	if (!file_exists($dirSnapsDeletados)) {
		mkdir($dirSnapsDeletados);
	}

	rename($dirSnaps.'/'.$removeSnap, $dirSnapsDeletados.'/'.$removeSnap);
}
?>