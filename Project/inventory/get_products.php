<?php
$host    = "localhost";
$dbUser  = "root";
// $dbPass  = "ce174";
$dbPass  = "";
$dbName  = "my_database";
// $dbPort  = 3307;
$dbPort  = 8000;

$conn = new mysqli($host, $dbUser, $dbPass, $dbName, $dbPort);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT ProductName, Supplier, HSNCode, Quantity, Price, EntryDate FROM products ORDER BY EntryDate DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>" . htmlspecialchars($row["ProductName"]) . "</td>
                <td>" . htmlspecialchars($row["Supplier"]) . "</td>
                <td>" . htmlspecialchars($row["HSNCode"]) . "</td>
                <td>" . htmlspecialchars($row["Quantity"]) . "</td>
                <td>" . htmlspecialchars($row["Price"]) . "</td>
                <td>" . htmlspecialchars($row["EntryDate"]) . "</td>
                <td><button class='delete-btn'>Delete</button></td>
              </tr>";
    }
} else {
    echo "<tr><td colspan='7'>No products found.</td></tr>";
}

$conn->close();
?>
