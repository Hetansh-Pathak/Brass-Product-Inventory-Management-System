<?php
$host    = "localhost";
$user    = "root";
// $password= "ce174";
$password= "";
$dbname  = "my_database";
// $port    = 3307;
$port    = 8000;

$conn = new mysqli($host, $user, $password, $dbname, $port);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$materialName = $_POST['materialName'];
$supplier     = $_POST['supplier'];
$quantity     = (int)$_POST['quantity'];
$cost         = (float)$_POST['cost'];
$entryDate    = $_POST['entryDate'];
$hsnCode      = $_POST['hsnCode'];

$sql1 = "INSERT INTO rawmaterials (MaterialName, Supplier, Quantity, Cost, EntryDate, HSNCode)
        VALUES (?, ?, ?, ?, ?, ?)";
$stmt1 = $conn->prepare($sql1);
$stmt1->bind_param("ssidss", $materialName, $supplier, $quantity, $cost, $entryDate, $hsnCode);

if (!$stmt1->execute()) {
    die("Error inserting raw material: " . $stmt1->error);
}
$stmt1->close();

$materialType = "Raw";
$sql2 = "INSERT INTO InwardTransactions (ProductName, HSNCode, Sender, Quantity, Price, EntryDate, Material)
         VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param("sssidss", $materialName, $hsnCode, $supplier, $quantity, $cost, $entryDate, $materialType);

if (!$stmt2->execute()) {
    die("Error inserting inward transaction: " . $stmt2->error);
}
$stmt2->close();

$conn->close();
echo "Success";
?>
