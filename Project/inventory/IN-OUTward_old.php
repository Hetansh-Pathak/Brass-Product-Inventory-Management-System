<?php
// // IN-OUTward.php
// require_once 'order.php'; // Database connection file

// // Insert Inward Entry when new Product or Raw Material is added
// function insertInward($materialType, $name, $hsnCode, $sender, $quantity, $price, $entryDate) {
//     global $conn;

//     $stmt = $conn->prepare("INSERT INTO inwardtransactions (Material, ProductName, HSNCode, Sender, Quantity, Price, EntryDate) VALUES (?, ?, ?, ?, ?, ?, ?)");
//     $stmt->bind_param("ssssiis", $materialType, $name, $hsnCode, $sender, $quantity, $price, $entryDate);
//     $stmt->execute();
//     $stmt->close();
// }

// // Move to Outward and Delete from Main Table when Product/Raw Material is deleted
// function moveToOutwardAndDelete($materialType, $id, $tableName) {
//     global $conn;

//     // Fetch the record before deleting
//     $query = "SELECT * FROM $tableName WHERE ID = ?";
//     $stmt = $conn->prepare($query);
//     $stmt->bind_param("i", $id);
//     $stmt->execute();
//     $result = $stmt->get_result();
//     $item = $result->fetch_assoc();
//     $stmt->close();

//     if ($item) {
//         // Insert into Outward Transactions
//         $stmt = $conn->prepare("INSERT INTO outwardtransactions (Material, ProductName, HSNCode, Sender, Quantity, Price, EntryDate) VALUES (?, ?, ?, ?, ?, ?, ?)");
//         $stmt->bind_param("sssiiis", $materialType, $item['ProductName'], $item['HSNCode'], $item['Sender'], $item['Quantity'], $item['Price'], $item['EntryDate']);
//         $stmt->execute();
//         $stmt->close();

//         // Delete from Inward Transactions
//         $stmt = $conn->prepare("DELETE FROM inwardtransactions WHERE ProductName = ? AND HSNCode = ?");
//         $stmt->bind_param("ss", $item['ProductName'], $item['HSNCode']);
//         $stmt->execute();
//         $stmt->close();

//         // Finally delete from Main Table (products/rawmaterials)
//         $stmt = $conn->prepare("DELETE FROM $tableName WHERE ID = ?");
//         $stmt->bind_param("i", $id);
//         $stmt->execute();
//         $stmt->close();
//     }
// }
?>

<?php
// IN-OUTward.php
// require_once '../orders/order.php'; // Database connection

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


function insertInward($materialType, $productName, $hsnCode, $sender, $quantity, $price, $entryDate) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO inwardtransactions (Material, ProductName, HSNCode, Sender, Quantity, Price, EntryDate) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssiis", $materialType, $productName, $hsnCode, $sender, $quantity, $price, $entryDate);
    $stmt->execute();
    $stmt->close();
}

function moveToOutwardAndDelete($materialType, $tableName, $id) {
    global $conn;

    $query = "SELECT * FROM $tableName WHERE ID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();
    $stmt->close();

    if ($data) {
        // Insert into outwardtransactions
        $stmt = $conn->prepare("INSERT INTO outwardtransactions (Material, ProductName, HSNCode, Sender, Quantity, Price, EntryDate) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssiiis", $materialType, $data['ProductName'], $data['HSNCode'], $data['Sender'], $data['Quantity'], $data['Price'], $data['EntryDate']);
        $stmt->execute();
        $stmt->close();

        // Delete from inwardtransactions
        $stmt = $conn->prepare("DELETE FROM inwardtransactions WHERE ProductName = ? AND HSNCode = ?");
        $stmt->bind_param("ss", $data['ProductName'], $data['HSNCode']);
        $stmt->execute();
        $stmt->close();

        // Delete from products or rawmaterials
        $stmt = $conn->prepare("DELETE FROM $tableName WHERE ID = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
    }
}
?>
