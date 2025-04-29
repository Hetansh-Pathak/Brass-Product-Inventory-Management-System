<?php
// add_product.php
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

// Retrieve values from POST (make sure your AJAX/form sends these)
$productName = $_POST['productName'];
$supplier    = $_POST['supplier'];
$hsnCode     = $_POST['hsnCode'];
$quantity    = (int)$_POST['quantity'];
$price       = (float)$_POST['price'];
$entryDate   = $_POST['entryDate'];

// For our purpose, we set material type as "Product"
$material    = "Product";

// 1. Insert into Products table
$stmt = $conn->prepare("INSERT INTO products (ProductName, HSNCode, Quantity, Price, EntryDate, Supplier) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssidss", $productName, $hsnCode, $quantity, $price, $entryDate, $supplier); // types: s=string, i=integer, d=double
if (!$stmt->execute()) {
    die("Error inserting product: " . $stmt->error);
}
$stmt->close();

// 2. Insert into InwardTransactions table (assuming Sender is same as Supplier)
$stmt2 = $conn->prepare("INSERT INTO inwardTransactions (ProductName, HSNCode, Sender, Quantity, Price, EntryDate, Material) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt2->bind_param("sssidss", $productName, $hsnCode, $supplier, $quantity, $price, $entryDate, $material);
if (!$stmt2->execute()) {
    die("Error inserting inward transaction: " . $stmt2->error);
}
$stmt2->close();

$conn->close();
echo "Success";
?>
