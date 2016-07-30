<?php 

$res = json_decode(file_get_contents('php://input', 'r'), true);

// $postData=file_get_contents('php://input', true);
// $d=json_decode($postData);
// $username=isset($d->username)?dhtmlspecialchars($d->username):'';
// $password=isset($d->password)?dhtmlspecialchars($d->password):''; 

session_start();

$_SESSION['username'] = $res['username'];
$_SESSION['password'] = $res['password'];

$opt = array('errno' => 0, 'data' => array('username' => $res['username']));

echo json_encode($opt);

 ?>