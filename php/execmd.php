<?php
chdir("..");

function isWindows() {
	if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    return true;
	}
	return false;
}


function execmd($command) {
	if (isWindows()) {
		exec($command." 2>&1", $outputArray);
		$output = implode("\n", $outputArray);
		return $output;
	} else {
		$locale = 'en_US.utf-8';
		setlocale(LC_ALL, $locale);
		putenv('LC_ALL='.$locale);

		exec($command." 2>&1", $outputArray);
		$output = implode("\n", $outputArray);
		return $output;
	}
}


function execScriptLattesDiff($params = "") {
	if (isWindows()) {
		return execmd("run.bat " . $params);
	}
	else {
		return execmd("bash run.sh ".$params);
	}
}

?>