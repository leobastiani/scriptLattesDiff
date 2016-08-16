<?php
chdir("..");

function execmd($command) {
	exec($command." 2>&1", $outputArray);
	$output = implode("\n", $outputArray);
	return $output;
}


function execScriptLattesDiff($params = "") {
	return execmd("run.bat " . $params);
}

?>