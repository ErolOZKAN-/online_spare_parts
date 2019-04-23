<?php
$id = $_POST['id'];
$filename = "documents/" . $id . ".txt";
$myfile = fopen($filename, "r") or die("Unable to open file!");
echo fread($myfile, filesize($filename));
fclose($myfile);
?>