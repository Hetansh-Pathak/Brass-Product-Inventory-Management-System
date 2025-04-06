<?php
$host = "localhost";
$username = "root";
$password = "ce174";
$port = 3307;

$conn = new mysqli($host, $username, $password, "", $port);

if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
} else {
    echo "✅ Connected successfully without selecting a database";
 

    $sql = "INSERT INTO users (name, email, password)
VALUES ('John Doe', 'john@example.com', '12345');";
}

?>
