<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "my_database";
$port = 8000;

// Create connection
$conn = new mysqli($servername, $username, $password, $database, $port);

if ($conn->connect_error) {
  http_response_code(500);
  echo "Connection failed: " . $conn->connect_error;
  exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['productName'])) {
  $productName = $_POST['productName'];

  // Step 1: Get the product from products table
  $stmtSelect = $conn->prepare("SELECT * FROM products WHERE productName = ?");
  $stmtSelect->bind_param("s", $productName);
  $stmtSelect->execute();
  $result = $stmtSelect->get_result();

  if ($result->num_rows === 0) {
    echo "Product not found.";
    exit;
  }

  $product = $result->fetch_assoc();

  // Safety: fallback values to prevent null insertion
  $pname     = $product['productName'] ?? 'Unknown';
  $hsnCode   = $product['hsnCode']     ?? 'N/A';
  $receiver  = "AutoMove";
  $quantity  = floatval($product['quantity'] ?? 0);
  $cost      = floatval($product['price'] ?? 0);
  $entryDate = $product['entryDate']   ?? date("Y-m-d");
  $material  = "product";

  // Step 2: Insert into outwardtransactions
  $stmtInsert = $conn->prepare("INSERT INTO outwardtransactions (ProductName, HSNCode, Receiver, Quantity, Cost, EntryDate, Material)
    VALUES (?, ?, ?, ?, ?, ?, ?)");

  if (!$stmtInsert) {
    echo "Insert prepare failed: " . $conn->error;
    exit;
  }

  $stmtInsert->bind_param(
    "sssddss",
    $pname,
    $hsnCode,
    $receiver,
    $quantity,
    $cost,
    $entryDate,
    $material
  );

  if (!$stmtInsert->execute()) {
    echo "Insert to outwardtransactions failed: " . $stmtInsert->error;
    exit;
  }

  // Step 3: Delete from products table
  $stmtDelete = $conn->prepare("DELETE FROM products WHERE productName = ?");
  $stmtDelete->bind_param("s", $productName);
  if ($stmtDelete->execute()) {
    echo "Success";
  } else {
    echo "Delete failed: " . $stmtDelete->error;
  }

  $stmtSelect->close();
  $stmtInsert->close();
  $stmtDelete->close();
} else {
  echo "Invalid request.";
}

$conn->close();
?>
