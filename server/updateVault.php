<?php
require '/usr/local/www/login.php';
$servername = "localhost";

try {
    $conn = new PDO("mysql:host=$servername;dbname=www", $db_user, $db_pass);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT * FROM coffee";
    $stmt = $conn->query($sql)->fetchAll();

    header('Content-type: application/json');
    echo json_encode( $stmt );
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }
    $conn = null;