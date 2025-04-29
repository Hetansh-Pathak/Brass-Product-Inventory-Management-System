<?php
$host     = "localhost";
$user     = "root";
// $password = "ce174";
$password = "";
$dbname   = "my_database";
$port     = 8000;
// $port     = 3307;

$conn = new mysqli($host, $user, $password, $dbname, $port);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM inwardTransactions ORDER BY EntryDate DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
        echo "<tr>";
        echo "<td>" . htmlspecialchars($row["InwardID"]) . "</td>";
        echo "<td>" . htmlspecialchars($row["ProductName"]) . "</td>";
        echo "<td>" . htmlspecialchars($row["HSNCode"]) . "</td>";
        echo "<td>" . htmlspecialchars($row["Sender"]) . "</td>";
        echo "<td>" . htmlspecialchars($row["Quantity"]) . "</td>";
        echo "<td>" . htmlspecialchars($row["Price"]) . "</td>";
        echo "<td>" . htmlspecialchars($row["EntryDate"]) . "</td>";
        echo "<td>" . htmlspecialchars($row["Material"]) . "</td>";
        echo "</tr>";
    }
} else {
    echo "<tr><td colspan='8'>No inward transactions found.</td></tr>";
}

$conn->close();
?>
