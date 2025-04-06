<?php
$host = "localhost";
$username = "root";
$password = "ce174";           // ← Your MySQL Workbench password
$database = "my_database";     // ← Exact name of your DB
$port = 3307;                  // ← Your custom MySQL port

$conn = new mysqli($host, $username, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
} else {
    echo "✅ Connected successfully to 'my_database'";
}
?>
