<?php

function connect() {
	$db = new mysqli("localhost", "root", "", "agbooks");
	$db->query("Set names 'utf8'");
	return $db;
}

?>