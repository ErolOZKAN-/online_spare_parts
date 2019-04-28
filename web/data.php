<?php
$myfile = fopen("content/content.json", "r") or die("Unable to open file!");
echo fread($myfile,filesize("content/content.json"));
fclose($myfile);
?>