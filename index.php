<?php

require_once("db.inc.php");
require_once("library.php");

/*file_put_contents("log.txt", $_POST, FILE_APPEND);
file_put_contents("log.txt", "------------------------------\n", FILE_APPEND);
file_put_contents("log.txt", file_get_contents('php://input'), FILE_APPEND);
file_put_contents("log.txt", "------------------------------\n", FILE_APPEND);
file_put_contents("log.txt", $_GET, FILE_APPEND);
file_put_contents("log.txt", "------------------------------\n------------------------------\n------------------------------\n\n\n", FILE_APPEND);*/

$data = file_get_contents('php://input');
@$data = json_decode($data);
if ($data) {
    if (isset($data->action)) {
        switch ($data->action) {
            case "authenticate":
                authenticate($data);
                break;
            case "books":
                getBooks();
                break;
            case "registerUser":
                registerUser($data);
                break;
            case "classSize":
                getClassSize();
                break;
            case "order":
                orderBooks($data);
                break;
            case "check":
                getBooksForCheck();
                break;
            case "prefilledValuesRegisterUser":
                getPrefilledValuesRegisterUser();
                break;
            default: 
                break;
        }
    }
}

function authenticate($data) {  
    sleep(1); 
    $db = connect();
    $token = $db->real_escape_string(uniqid());
    $data = array();
    //$data["userid"] = uniqid();
    $data = $db->real_escape_string(serialize($data));
    $sql = "INSERT INTO `session` (token, `data`) VALUES ('Bearer $token', '$data')";
    $db->query($sql);
    $ret = array(
        "token" => $token
    );
    die(json_encode($ret));    
}

function dieWithMessage($message) {
    http_response_code(400);
    die(json_encode(array("message"=>$message)));
}


function registerUser($data) {
    //var_dump($data);
    putSession("teacher", $data->teacher);
    putSession("teacherShort", $data->teacherShort);
    putSession("grade", $data->grade);
    putSession("room", $data->room);
    putSession("classSize", $data->classSize);
    
    die(json_encode(array("status" => true)));

}

function getClassSize() {
    echo getSession("classSize");
    die();
}

function getBooks() {
    $grade = getSession("grade");
    $db = connect();
	if (startswith($grade, "5")) {
		$grade = "5";
	} else if (startswith($grade, "6")) {
		$grade = "6";
	}  else if (startswith($grade, "7")) {
		$grade = "7";
	}  else if (startswith($grade, "8")) {
		$grade = "8";
	}  else if (startswith($grade, "9")) {
		$grade = "9";
	}  else if (startswith($grade, "10")) {
		$grade = "10";
	}  else if (startswith($grade, "Q11")) {
		$grade = "Q11";
	}   else if (startswith($grade, "Q12")) {
		$grade = "Q12";
	}   else if (startswith($grade, "Q13")) {
		$grade = "Q13";
	} else {
		die("wrong grade!");
	}
	$grade = $db->real_escape_string($grade);
	$res = $db->query("SELECT * FROM `books` WHERE `$grade` = 1");
	$res = $res->fetch_all(MYSQLI_ASSOC);
    //echo $db->error;
    


    $classSize = getSession("classSize");
    $user = $db->real_escape_string(getUserToken());
    $order = $db->query("SELECT `order` FROM `orders` WHERE `user`='$user'");
    if ($order) {
        $order = $order->fetch_all(MYSQLI_ASSOC);
    } else {
        die($db->error);
    }
   
    if (isset($order[0]["order"])) {
        $order = unserialize($order[0]["order"]);
    } else {
        $order = array();
    }
    
    //var_dump($order);
    foreach ($res as &$book) {
        $book["number"] = $classSize;
        foreach ($order as $orderedBook) {
            if ($book["id"] == $orderedBook["id"]) {
                $book["number"] = $orderedBook["number"];
            }
        }
    }





	
	die(json_encode($res));
}

function orderBooks($data) {
    $order = array();
    foreach ($data->books as $book) {
        $order[] = array("id"=> $book->id, "number" => $book->bookNumber);
    }
    $db = connect();
    $data = $db->real_escape_string(serialize($order));
    $token = $db->real_escape_string(getUserToken());
    $res = $db->query("SELECT * FROM `orders` WHERE `user`='$token'");
    if ($res) {
        $res = $res->fetch_all(MYSQLI_ASSOC) or false;
        if ($res && isset($res[0]) && isset($res[0]["order"])) {
            $res = $db->query("UPDATE `orders` SET `order`='$data', `checked`=0 WHERE `user`='$token'");
        } else {
            $res = $db->query("INSERT INTO `orders` (`user`, `order`, `checked`) VALUES ('$token', '$data', 0)");
        }
    } else {
        $res = $db->query("INSERT INTO `orders` (`user`, `order`, `checked`) VALUES ('$token', '$data', 0)");
    }
    
    if ($res) {
        die(true);
    } else {
        die($db->error);
    }
}

function getBooksForCheck() {
    $db = connect();

    $classSize = intval(getSession("classSize"));

    $books = [];
    $res = $db->query("SELECT * FROM books");
    if ($res) {
        $res = $res->fetch_all(MYSQLI_ASSOC);
        if ($res) {
            foreach ($res as $book) {
                $books[$book["id"]] = array("name" => $book["name"], "subject" => $book["subject"]);
            }
        } else {
            die($db->error);
        }
    }  else {
        die($db->error);
    }


    $user = $db->real_escape_string(getUserToken());
    $res = $db->query("SELECT `order` FROM `orders` WHERE `user`='$user'");
    if ($res) {
        $res = $res->fetch_all(MYSQLI_ASSOC);
    } else {
        die($db->error);
    }
    //var_dump($books);
    

    $order = [];
    $res = unserialize($res[0]["order"]);
    foreach ($res as $book) {
        if (intval($book["number"]) != $classSize) {
            $alert = "Die Buchanzahl entspricht nicht der Klassenstärke!";
        } else {
            $alert = "";
        }
        //var_dump($book);
        $order[] = array(
            "id" => $book["id"],
            "name" => $books[$book["id"]]["name"],
            "subject" => $books[$book["id"]]["subject"],
            "number" => $book["number"],
            "alert" => $alert
        );

    }

    echo json_encode($order);
    die();
}

function getPrefilledValuesRegisterUser() {
    echo json_encode(array(
        "teacher" => getSession("teacher"),
        "teacherShort" => getSession("teacherShort"),
        "grade" => getSession("grade"),
        "room" => getSession("room"),
        "classSize" => getSession("classSize")
    ));
}

function submitOrder() {
    $db->query("UPDATE `orders` SET `checked`=1 WHERE `user`='$user'");
}