<?php
require '/usr/local/www/login.php';
$servername = "localhost";

if (isset($_FILES['uploaded_file'])) {
    if(move_uploaded_file($_FILES['uploaded_file']['tmp_name'], "uploaded/" . $_FILES['uploaded_file']['name'])){
        echo $_FILES['uploaded_file']['name']. " uploaded ...";
        try {
            $conn = new PDO("mysql:host=$servername;dbname=www", $db_user, $db_pass);
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            //construct file and name parameters
            $file = "'/wad18/server/uploaded/" . $_FILES['uploaded_file']['name'] . "'";
            $name = "'" . $_POST['description'] . "'";
            
            $sql = "INSERT INTO coffee (name, file) VALUES ($name, $file)";
            $conn->exec($sql);
            }
        catch(PDOException $e)
            {
            echo "Connection failed: " . $e->getMessage();
            unlink("uploaded/" . $_FILES['uploaded_file']['name']);
            }
    } else {
        echo $_FILES['uploaded_file']['name']. " NOT uploaded ...";
    }

    exit;
} else {
    echo "no";
}

$conn = null; 