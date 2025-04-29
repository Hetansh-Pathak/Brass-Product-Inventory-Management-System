<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "my_database";
$port = 8000;

// Create connection
$conn = new mysqli($servername, $username, $password, $database, $port);

// Better error handling
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Fetch available products
$sql = "SELECT productName, supplier, hsnCode, quantity, price, entryDate FROM products"; // your table name
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    echo '<tr data-id="' . htmlspecialchars($row['productName']) . '">';
    echo '<td><input type="text" value="' . htmlspecialchars($row['productName']) . '" readonly></td>';
    echo '<td><input type="text" value="' . htmlspecialchars($row['supplier']) . '" readonly></td>';
    echo '<td><input type="text" value="' . htmlspecialchars($row['hsnCode']) . '" readonly></td>';
    echo '<td><input type="number" value="' . htmlspecialchars($row['quantity']) . '" readonly></td>';
    echo '<td><input type="number" value="' . htmlspecialchars($row['price']) . '" readonly></td>';
    echo '<td><input type="text" value="' . htmlspecialchars($row['entryDate']) . '" readonly></td>';
    echo '<td><button onclick="deleteRow(this)" class="delete-btn">Delete</button></td>';
    echo '</tr>';
  }
} else {
  echo "<tr><td colspan='7'>No products available</td></tr>";
}

$conn->close();
?>
