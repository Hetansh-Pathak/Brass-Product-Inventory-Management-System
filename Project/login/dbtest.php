<?php
$host = "localhost";
$username = "root";
$password = "ce174";           
$database = "my_database";     
$port = 3307;                  

$conn = new mysqli($host, $username, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
} else {
    echo "✅ Connected successfully to 'my_database'";
}
?>
