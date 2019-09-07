<?php
define("SSE_DELAY", 1);
require_once("db.inc.php");
require_once("library.php");

/*file_put_contents("log.txt", $_POST, FILE_APPEND);
file_put_contents("log.txt", "------------------------------\n", FILE_APPEND);
file_put_contents("log.txt", file_get_contents('php://input'), FILE_APPEND);
file_put_contents("log.txt", "------------------------------\n", FILE_APPEND);
file_put_contents("log.txt", $_GET, FILE_APPEND);
file_put_contents("log.txt", "------------------------------\n------------------------------\n------------------------------\n\n\n", FILE_APPEND);*/

if(isset($_GET["queue"])&&isset($_GET["token"])) {
    $db = connect();
    set_time_limit(0);
    date_default_timezone_set("Europe/Berlin");
    header('Cache-Control: no-cache');
    header("Content-Type: text/event-stream\n\n");
    while (1) {
        echo "event: update\n";
        $ordersLeft = "berechnen...";
        $orderReady = false;
        $token = $db->real_escape_string($_GET["token"]);
        //die($user);
        $res = $db->query("SELECT COUNT(*) AS ordersLeft FROM orders WHERE `checked`='1' AND `done`='0' AND `accepted` != '1' AND `time` < (SELECT `time` FROM orders WHERE `user`= 'Bearer $token') ORDER BY `time` DESC");
        //$ordersLeft = $res;
        if ($res) {
            $res = $res->fetch_all(MYSQLI_ASSOC);
            if (isset($res) && isset($res[0]) && isset($res[0]["ordersLeft"])) {
                $ordersLeft = $res[0]["ordersLeft"];
            }
        }
        if ($ordersLeft == 0) {
            $res = $db->query("SELECT `done` FROM orders WHERE `user`= 'Bearer $token'");
            if ($res) {
                $res = $res->fetch_all(MYSQLI_ASSOC);
                if (isset($res) && isset($res[0]) && isset($res[0]["done"]) && $res[0]["done"] == 1) {
                    $orderReady = true;
                }
            }
        } 
        
        $data = json_encode(array("ordersLeft"=>$ordersLeft, "orderReady"=>$orderReady));
        echo "data: $data";
        echo "\n\n";
        @ob_end_flush();
        flush();
        sleep(SSE_DELAY);
    }
    die();
}

if(isset($_GET["queueHandover"])&&isset($_GET["token"])) {
    $db = connect();
    set_time_limit(0);
    date_default_timezone_set("Europe/Berlin");
    header('Cache-Control: no-cache');
    header("Content-Type: text/event-stream\n\n");
    while (1) {
        echo "event: update\n";
        $success = false;
        
        $token = $db->real_escape_string($_GET["token"]);
        //die($user);
        $res = $db->query("SELECT `data` FROM `session` WHERE `token`= 'Bearer $token'");
        //$ordersLeft = $res;
        if ($res) {
            $res = $res->fetch_all(MYSQLI_ASSOC);
            if (isset($res) && isset($res[0]) && isset($res[0]["data"])) {
                $data = unserialize($res[0]["data"]);
                if (isset($data["handoverCode"]) && $data["handoverCode"] == "") {
                    $success = true;
                }
            }
        } else {
            echo $db->error;
        }
        
        
        $data = json_encode(array("success"=>$success));
        echo "data: $data";
        echo "\n\n";
        @ob_end_flush();
        flush();
        sleep(SSE_DELAY);
    }
    die();
}

if(isset($_GET["queueBackend"])) {
    set_time_limit(0);
    header('Cache-Control: no-cache');
    header("Content-Type: text/event-stream\n\n");
    while (1) {
        echo "event: update\n";
        
        $data = json_encode(array("orders"=>getOrdersBackend()));
        echo "data: $data";
        echo "\n\n";
        
        @ob_end_flush();
        flush();
        sleep(SSE_DELAY);
    }
    die();
}




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
            case "submit":
                submitOrder();
            case "accept":
                acceptOrder();
            case "handoverCode":
                handoverCode();
            case "checkHandoverCode":
                checkHandoverCode($data);
            case "returnTo":
                getReturnTo();



            case "authenticateBackend":
                authenticateBackend($data);
                break;
            case "orders backend":
                die(json_encode(getOrdersBackend()));
                break;
            case "analysis backend":
                die(json_encode(analysisBackend()));
                break;
            case "avalibleBooks backend":
                getAvalibleBooksBackend($data);
                break;
            case "setOrderDone backend":
                setorderDoneBackend($data);
                break;



            default: 
                break;
        }
    }
}

function authenticateBackend($data)  {
    if (isset($data->email) &&
    isset($data->password) &&
    !empty(trim($data->email)) &&
    !empty(trim($data->password))) {
        
        $db = connect();
        
        $email = $db->real_escape_string(strtolower($data->email));
        $res = $db->query("SELECT id, `password`, email FROM users WHERE email='$email'");
        
        if (!$res) {
            
            dieWithMessage("Bitte überprüfen Sie Ihre Email Adresse!");
        } else {
            $res = $res->fetch_all(MYSQLI_ASSOC);
            if (!$res) {
                
                dieWithMessage("Bitte überprüfen Sie Ihre Email Adresse!");
            } else {
                $res = $res[0];
                if (!$res) {
                    
                    dieWithMessage("Bitte überprüfen Sie Ihre Email Adresse!");
                } else {
                    $password = $res["password"];
                    $status = password_verify($data->password, $password);
                    
                    if ($status) {                            
                        
                        
                        //putSession("userid", $res["id"]);

                        $token = $db->real_escape_string(uniqid());
                        $data = array();
                        $data["userid"] = $res["id"];
                        $data = $db->real_escape_string(serialize($data));
                        $sql = "INSERT INTO `session` (token, `data`) VALUES ('Bearer $token', '$data')";
                        $db->query($sql);
                        //echo $sql;


                        
                        $ret = array(
                            "id" => $res["id"],
                            "email" => $res["email"],
                            "token" => $token
                            
                        );
                        die(json_encode($ret));
                    } else {
                        dieWithMessage("Bitte überprüfen Sie Ihr Passwort!");
                    }
                }
            }  
        }
    }
    dieWithMessage("Nicht alle Felder wurden ausgefüllt!");
    
}

function getOrdersBackend() {
    $db = connect();

    $userinfo = [];
    $users = $db->query("SELECT * FROM `session`");
    if ($users) {
        $users = $users->fetch_all(MYSQLI_ASSOC);
        if ($users) {
            foreach ($users as $user) {
                $userinfo[$user["token"]] = unserialize($user["data"]);
            }
        }
    }

    $bookinfo = [];
    $books = $db->query("SELECT * FROM `books`");
    if ($books) {
        $books = $books->fetch_all(MYSQLI_ASSOC);
        if ($books) {
            foreach ($books as $book) {
                $bookinfo[$book["id"]] = $book;
            }
        }
    }


    $data = [];
    $res = $db->query("SELECT * FROM `orders` WHERE `checked`='1' ORDER BY `time` ASC");
    if ($res) {
        $res = $res->fetch_all(MYSQLI_ASSOC);
        if ($res) {
            //($res);
            foreach ($res as $key => $line) {
                
                $line["order"] = unserialize($line["order"]);
                $completeOrder = [];
                
                foreach ($line["order"] as $order) {
                    $completeOrder[] = array(
                        "name" => $bookinfo[$order["id"]]["name"],
                        "subject" => $bookinfo[$order["id"]]["subject"],
                        "number" => $order["number"]
                    );
                }

                $line["order"] = $completeOrder;

                $line["user"] = $userinfo[$line["user"]];
            
                  
               
                
                $data[] = $line;
            }
            return $data;
        }
    }
    return $db->error;
}

function analysisBackend() {
    $db = connect();

    $userinfo = [];
    $users = $db->query("SELECT * FROM `session`");
    if ($users) {
        $users = $users->fetch_all(MYSQLI_ASSOC);
        if ($users) {
            foreach ($users as $user) {
                $userinfo[$user["token"]] = unserialize($user["data"]);
            }
        }
    }

    $bookinfo = [];
    $books = $db->query("SELECT * FROM `books`");
    if ($books) {
        $books = $books->fetch_all(MYSQLI_ASSOC);
        if ($books) {
            foreach ($books as $book) {
                $bookinfo[$book["id"]] = $book;
            }
        }
    }


    $orders = [];
    $res = $db->query("SELECT * FROM `orders` WHERE `checked`='1' ORDER BY `time` ASC");
    if ($res) {
        $res = $res->fetch_all(MYSQLI_ASSOC);
        if ($res) {
            //($res);
            foreach ($res as $key => $line) {
                
                $line["order"] = unserialize($line["order"]);
                $completeOrder = [];
                
                foreach ($line["order"] as $order) {
                    $completeOrder[] = array(
                        "name" => $bookinfo[$order["id"]]["name"],
                        "subject" => $bookinfo[$order["id"]]["subject"],
                        "number" => $order["number"]
                    );
                }

                $line["order"] = $completeOrder;

                $line["user"] = $userinfo[$line["user"]];
            
                  
               
                
                $orders[] = $line;
            }
            return array("orders"=>$orders, "books"=>$bookinfo);
        }
    }
    return $db->error;
}

function getAvalibleBooksBackend($data) {
    $grade = $data->grade;
    $db = connect();
    $where = "";
    $checkLang = true;
    $checkBranch = true;
    $language = $data->language;
    $branch = $data->branch;
    $uebergang = $data->uebergang;
	if (startswith($grade, "5")) {
        $grade = "5";
        $checkLang = false;
        $checkBranch = false;
	} else if (startswith($grade, "6")) {
        $grade = "6";
        $checkBranch = false;
	}  else if (startswith($grade, "7")) {
        $grade = "7";
        $checkBranch = false;
	}  else if (startswith($grade, "8")) {
		$grade = "8";
	}  else if (startswith($grade, "9")) {
		$grade = "9";
	}  else if (startswith($grade, "10")) {
        $grade = "10";
        if ($uebergang == "j") {
            $where .= "AND `uebergang` = '1'";
            $checkBranch = false;
            $checkLanguage = false;
        }
	}  else if (startswith($grade, "Q11")) {
        $grade = "Q11";
        $checkLang = false;
        $checkBranch = false;
	}   else if (startswith($grade, "Q12")) {
        $grade = "Q12";
        $checkLang = false;
        $checkBranch = false;
	}   else if (startswith($grade, "Q13")) {
        $grade = "Q13";
        $checkLang = false;
        $checkBranch = false;
	} else {
		die("wrong grade!".$grade);
    }

    if ($checkLang == true) {
        if ($language == "f" || $language == "l") {
            
            $where .= "AND (`language` = '$language' OR `language`='' OR `language` IS NULL)";
        }
    }
    if ($checkBranch == true) {
        if ($branch == "n" || $branch == "s") {
            $where .= "AND (`branch` = '$branch' OR `branch`='' OR `branch` IS NULL)";
        }
        $where .= "AND `branch`!='sf'";
    }

    
    $grade = $db->real_escape_string($grade);
    $sql = "SELECT * FROM `books` WHERE `$grade` = 1 $where ORDER BY `subject`";
    $res = $db->query($sql);
    //echo $sql;
    //echo "\n";
    //echo $db->error;
    //die();
	$res = $res->fetch_all(MYSQLI_ASSOC);

	die(json_encode($res));
}

function setorderDoneBackend($data) {
    $db = connect();
    $id = $db->real_escape_string($data->id);
    $res = $db->query("UPDATE `orders` SET `done` = '1' WHERE `orders`.`id` = $id");
    if ($res) {
        die(json_encode(true));
    } else {
        dieWithMessage($db->error);
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
    putSession("course", $data->course);
    putSession("language", $data->language);
    putSession("branch", $data->branch);
    putSession("uebergang", $data->uebergang);
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
    $where = "";
    $checkLang = true;
    $checkBranch = true;
    $language = getSession("language");
    $branch = getSession("branch");
    $uebergang = getSession("uebergang");
	if (startswith($grade, "5")) {
        $grade = "5";
        $checkLang = false;
        $checkBranch = false;
	} else if (startswith($grade, "6")) {
        $grade = "6";
        $checkBranch = false;
	}  else if (startswith($grade, "7")) {
        $grade = "7";
        $checkBranch = false;
	}  else if (startswith($grade, "8")) {
		$grade = "8";
	}  else if (startswith($grade, "9")) {
		$grade = "9";
	}  else if (startswith($grade, "10")) {
        $grade = "10";
        if ($uebergang == "j") {
            $where .= "AND `uebergang` = '1'";
            $checkBranch = false;
            $checkLanguage = false;
        }
	}  else if (startswith($grade, "Q11")) {
        $grade = "Q11";
        $checkLang = false;
        $checkBranch = false;
	}   else if (startswith($grade, "Q12")) {
        $grade = "Q12";
        $checkLang = false;
        $checkBranch = false;
	}   else if (startswith($grade, "Q13")) {
        $grade = "Q13";
        $checkLang = false;
        $checkBranch = false;
	} else {
		die("wrong grade!".$grade);
    }

    if ($checkLang == true) {
        if ($language == "f" || $language == "l") {
            
            $where .= "AND (`language` = '$language' OR `language`='' OR `language` IS NULL)";
        }
    }
    if ($checkBranch == true) {
        if ($branch == "n" || $branch == "s") {
            $where .= "AND (`branch` = '$branch' OR `branch`='' OR `branch` IS NULL)";
        }
        $where .= "AND `branch`!='sf'";
    }

    




    $grade = $db->real_escape_string($grade);
    $sql = "SELECT * FROM `books` WHERE `$grade` = 1 $where ORDER BY `subject`";
    $res = $db->query($sql);
    //echo $sql;
    //echo "\n";
    //echo $db->error;
    //die();
	$res = $res->fetch_all(MYSQLI_ASSOC);
    
    


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
        $book["coverPath"] = $book["short"].".jpg";
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
            $res = $db->query("UPDATE `orders` SET `order`='$data', `checked`=0, `time`=NOW() WHERE `user`='$token'");
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

function handoverCode() {
    $db = connect();
    $code = (string)mt_rand (10000 , 99999);
    putSession("handoverCode", $code);      
    die($code);
}

function checkHandoverCode($params) {
    $db = connect();
    $userToken = false;
    $sql = "SELECT `token`, `data` FROM `session`";
    $res = $db->query($sql);
    if ($res) {
        $res = $res->fetch_all(MYSQLI_ASSOC);
        if ($res) {
            foreach ($res as $line) {
                $data = unserialize($line["data"]);
                if (isset($data["handoverCode"]) && $data["handoverCode"]==$params->handoverCode) {
                    
                   
                    $userToken = $line["token"];
                    $data["handoverCode"] = "";
                    $data = $db->real_escape_string(serialize($data));
                    $res = $db->query("UPDATE `session` SET `data` = '$data' WHERE `token` = '$userToken'");
                    $userToken = str_replace("Bearer ", "", $userToken);
                    //echo $db->affected_rows;
                    
                   
                }
            }
        }
	}
	die(json_encode($userToken));
}

function getReturnTo() {
    $db = connect();
    $token = getUserToken();
    $returnTo = "/step/1";
    $res = $db->query("SELECT `checked`, `done`, `accepted` FROM `orders` WHERE `user` = '$token'");
    if ($res) {
        $res = $res->fetch_all(MYSQLI_ASSOC);
        if ($res && isset($res[0])) {
            if ($res[0]["checked"] == 0) {
               $returnTo = "/step/2";
            } else if ($res[0]["checked"] == 1 && $res[0]["done"] == 0 ) {
                $returnTo = "/step/5";
            } else if ($res[0]["checked"] == 1 && $res[0]["done"] == 1 && $res[0]["accepted"] == 0) {
                $returnTo = "/step/5";
            }  else if ($res[0]["checked"] == 1 && $res[0]["done"] == 1 && $res[0]["accepted"] == 1) {
                $returnTo = "/step/6";
            }
        
        }
    }
    
	die(json_encode($returnTo));
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

    $religion_gesamt = 0;
    $religionsbuecher = array("Religion ev", "Religion rk", "Ethik");
    foreach ($res as $book) {
        if (in_array($books[$book["id"]]["subject"], $religionsbuecher)) {
            $religion_gesamt += $book["number"];
        }
    }
    $religion_alert = false;
    if ($religion_gesamt  != $classSize) {
        $religion_alert = true;
    }


    foreach ($res as $book) {
        if (in_array($books[$book["id"]]["subject"], $religionsbuecher) ) {
            if ($religion_alert == true) {
                $alert = "Die Gesamtanzahl der Religionsbücher entspricht nicht der Klassenstärke!";
            }

        } else {
            if (intval($book["number"]) != $classSize) {
                $alert = "Die Buchanzahl entspricht nicht der Klassenstärke!";
            } else {
                $alert = "";
            }
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
        "course" => getSession("course"),
        "language" => getSession("language"),
        "uebergang" => getSession("uebergang"),
        "branch" => getSession("branch"),
        "room" => getSession("room"),
        "classSize" => getSession("classSize")
    ));
}

function submitOrder() {
    $db = connect();
    $user = $db->real_escape_string(getUserToken());
    $res = $db->query("UPDATE `orders` SET `checked`=1, `time`=NOW() WHERE `user`='$user'");
    if ($res) {
        die(true);
    } else {
        die($db->error);
    }
}

function acceptOrder() {
    $db = connect();
    $user = $db->real_escape_string(getUserToken());
    $res = $db->query("UPDATE `orders` SET `accepted`=1 WHERE `user`='$user'");
    if ($res) {
        die(true);
    } else {
        die($db->error);
    }
}