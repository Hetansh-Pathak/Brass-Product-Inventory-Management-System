<?php
$host = "localhost";
$user = "root";
// $password = "ce174";
$password = "";
$dbname = "my_database";
// $port = 3307;
$port = 8000;

$conn = new mysqli($host, $user, $password, $dbname, $port);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM rawmaterials ORDER BY EntryDate DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<tr data-id='" . $row['RawMaterialID'] . "'>";
        echo "<td>" . htmlspecialchars($row['MaterialName']) . "</td>";
        echo "<td>" . htmlspecialchars($row['Supplier']) . "</td>";
        echo "<td>" . htmlspecialchars($row['Quantity']) . "</td>";
        echo "<td>" . htmlspecialchars($row['Cost']) . "</td>";
        echo "<td>" . htmlspecialchars($row['EntryDate']) . "</td>";
        echo "<td>" . htmlspecialchars($row['HSNCode']) . "</td>";
        echo "<td><button onclick='deleteRawMaterial(" . $row['RawMaterialID'] . ")'>Delete</button></td>";
        echo "</tr>";
    }
} else {
    echo "<tr><td colspan='7'>No raw materials found.</td></tr>";
}

$conn->close();
?>
