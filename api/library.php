<?php

function incrementalHash($len = 5){
  $charset = "0123456789";
  $base = strlen($charset);
  $result = '';

  $now = explode(' ', microtime())[1];
  while ($now >= $base){
    $i = $now % $base;
    $result = $charset[$i] . $result;
    $now /= $base;
  }
  return substr($result, -5);
}

function putSession($key, $value) {
	//echo "Info: Saving $value in $key\n";
	$db = connect();
	$token = null;
	$headers = apache_request_headers();
	
	if(isset($headers['Authorization'])){
		
		$token = $db->real_escape_string($headers['Authorization']);
		
		$res = $db->query("SELECT * FROM `session` WHERE `token` = '$token'");
		if ($res) {
			
			$res = $res->fetch_all(MYSQLI_ASSOC);
			if ($res && isset($res[0]) && isset($res[0]["data"])) {
				//echo "update";
				//var_dump($res);
				$data = unserialize($res[0]["data"]);
				$data[$key] = $value;
				$data = serialize($data);
				$db->query("UPDATE `session` SET `data` = '$data' WHERE `token` = '$token'");
				//echo $db->error;
				return;
				
			}else {
				$data = array();
			}
		} else {
			$data = array();
		}
		//echo "new";
		$data[$key] = $value;
		$data = $db->real_escape_string(serialize($data));
		$sql = "INSERT INTO `session` (token, `data`) VALUES ('$token', '$data')";
		$db->query($sql);
		//echo $sql;
	} else {
		echo "no header";
	}
	
	  
}

function getSession($key) {
	
	$db = connect();
	$token = null;
	$headers = apache_request_headers();
	if(isset($headers['Authorization'])){
		$token = $db->real_escape_string($headers['Authorization']);
		$sql = "SELECT * FROM `session` WHERE `token` = '$token'";
		//echo $sql;
		$res = $db->query($sql);
		
		if ($res) {
			$res = $res->fetch_all(MYSQLI_ASSOC);
			//var_dump($res);
			
			if ($res && isset($res[0]) && isset($res[0]["data"])) {
				$data = unserialize($res[0]["data"]);
				//var_dump($data);
				if (isset($data[$key])) {
					return $data[$key];
				}
				
			}
		}
	}
	return "";
	//echo "Fehler bei getSession: ".$db->error."\n";
}



function startsWith($haystack, $needle) {
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
}


function getUserToken() {
	$db = connect();
	$token = null;
	$headers = apache_request_headers();
	if(isset($headers['Authorization'])){
		$token = $db->real_escape_string($headers['Authorization']);
		return $token;
	}
}
?>