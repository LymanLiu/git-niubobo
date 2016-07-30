<?php 

// $res = json_decode(file_get_contents('php://input', 'r'), true);

$newname = $_GET["newname"];

// session_start();

$_SESSION['username'] = $newname;



$opt = array('errno' => 0, 'data' => array('newname' => $newname));

echo json_encode($opt);

 ?>