<?php
$host = "localhost";
$user = "root";
$pass = "ce174";
$db = "my_database"; // Replace with your actual DB name
$port = 3307;

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $name = $_POST['productName'];

  $stmt = $conn->prepare("DELETE FROM products WHERE ProductName = ?");
  $stmt->bind_param("s", $name);

  if ($stmt->execute()) {
    echo "Success";
  } else {
    echo "Error deleting record.";
  }

  $stmt->close();
}

$conn->close();
?>
