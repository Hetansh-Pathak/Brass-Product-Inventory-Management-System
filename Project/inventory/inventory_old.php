<?php
// inventory.php

// Connection settings
$host = "localhost";
$dbUser = "root";
$dbPass = "";
$dbName = "my_database";
$dbPort = 8000;

$conn = new mysqli($host, $dbUser, $dbPass, $dbName, $dbPort);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Inventory Management</title>
  <link rel="stylesheet" href="inventory1.css" />
  <link rel="stylesheet" href="../darkmode.css" />
</head>
<body>
  <header>
    <h1>Inventory-management</h1>
    <nav>
      <ul>
        <li><a href="../first_page/firstpage.html">Home</a></li>
        <li><a href="../orders/orders.php">Orders</a></li>
        <li><a href="#available-stock" class="active">Product-management</a></li>
        <li><a href="../Available_material/available_material.html">Raw_material-management</a></li>
        <li><a href="../inventory/IN-OUTward.php">IN/OUT</a></li>
        <li><a href="../billing/billing.html">Billing</a></li>
      </ul>
    </nav>
  </header>

  <div class="top-search-bar">
    <input type="text" id="searchInput" placeholder="Search Product or Raw Material..." />
    <button onclick="searchInventory()">Search</button>
  </div>

  <section id="available-stock">
    <h2>Add Product</h2>
    <table id="stockTable">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Supplier</th>
          <th>HSN Code</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="text" id="productName" placeholder="Product Name"></td>
          <td><input type="text" id="supplier" placeholder="Supplier"></td>
          <td><input type="text" id="hsnCode" placeholder="HSN Code"></td>
          <td><input type="number" id="quantity" placeholder="Quantity"></td>
          <td><input type="number" id="price" placeholder="Price"></td>
          <td><input type="date" id="stockDate"></td>
          <td><button onclick="addToStock()">Add</button></td>
        </tr>
      </tbody>
    </table>

    <h3>Available Products</h3>
    <table id="productStock">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Supplier</th>
          <th>HSN Code</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="availableProductsBody">
        <?php
        $result = $conn->query("SELECT * FROM products");
        if ($result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
            echo "<tr data-id='" . htmlspecialchars($row['ProductName']) . "'>
              <td><input type='text' value='" . htmlspecialchars($row['ProductName']) . "' readonly></td>
              <td><input type='text' value='" . htmlspecialchars($row['Supplier']) . "' readonly></td>
              <td><input type='text' value='" . htmlspecialchars($row['HSNCode']) . "' readonly></td>
              <td><input type='number' value='" . htmlspecialchars($row['Quantity']) . "' readonly></td>
              <td><input type='number' value='" . htmlspecialchars($row['Price']) . "' readonly></td>
              <td><input type='date' value='" . htmlspecialchars($row['EntryDate']) . "' readonly></td>
              <td><button onclick='deleteRow(this)'>Delete</button></td>
            </tr>";
          }
        } else {
          echo "<tr><td colspan='7'>No products found.</td></tr>";
        }
        ?>
      </tbody>
    </table>
  </section>

  <script src="inventory_js.js"></script>
</body>
</html>
