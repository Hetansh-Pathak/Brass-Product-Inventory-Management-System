<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IN/OUT Transactions</title>
    <link rel="stylesheet" href="orders.css"> <!-- Assuming you want to use the same CSS -->
    <style>
      /* Extra Styling if Needed */
      table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
      }
      th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: center;
      }
      th {
          background-color: #2c3e50;
          color: white;
      }

      body {
      font-family: Arial, sans-serif;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2rem;
    }
    th, td {
      padding: 12px;
      border: 1px solid #ddd;
      text-align: center;
    }
    input[type="date"], input[type="number"], input[type="text"] {
      width: 100%;
      padding: 4px;
      box-sizing: border-box;
    }
    button {
      padding: 6px 10px;
      margin-top: 5px;
      cursor: pointer;
    }
    h2 {
      margin-top: 2rem;
    }
    .material-options {
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    .material-options label {
      font-size: 0.9rem;
    }
    .search-container {
      text-align: center;
      margin: 1.5rem auto;
    }
    #searchInput {
      width: 50%;
      padding: 10px;
      font-size: 16px;
    }
    </style>
</head>
<body>

<header>
  <div class="logo">
    <h1>IN/OUT Transactions</h1>
  </div>
</header>

<section class="hero">
  <div class="hero-content" style="color: black;">
    <h2>Inventory Movement Record</h2>
    <p>Shows real-time inward and outward transactions</p>
    <a href="../first_page/firstpage.html" class="btn" style="background-color: magenta;">Home</a>
    <a href="../products/products.php" class="btn" style="background-color: orange;">Products</a>
    <a href="../rawmaterials/rawmaterials.php" class="btn" style="background-color: teal;">Raw Materials</a>
  </div>
</section>

<section id="orders">
  <h2>Inward Transactions</h2>
  <table>
    <thead>
      <tr>
        <th>Inward ID</th>
        <th>Product Name</th>
        <th>HSN Code</th>
        <th>Sender</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Entry Date</th>
        <th>Material Type</th>
      </tr>
    </thead>
    <tbody>
      <!-- PHP code will fill this -->
      <?php
      // <!-- require_once '../order.php'; // adjust path if needed -->
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

      $sql = "SELECT * FROM inwardtransactions ORDER BY EntryDate DESC";
      $result = $conn->query($sql);

      if ($result && $result->num_rows > 0) {
          while($row = $result->fetch_assoc()) {
              echo "<tr>";
              echo "<td>" . htmlspecialchars($row['InwardID']) . "</td>";
              echo "<td>" . htmlspecialchars($row['ProductName']) . "</td>";
              echo "<td>" . htmlspecialchars($row['HSNCode']) . "</td>";
              echo "<td>" . htmlspecialchars($row['Sender']) . "</td>";
              echo "<td>" . htmlspecialchars($row['Quantity']) . "</td>";
              echo "<td>" . htmlspecialchars($row['Price']) . "</td>";
              echo "<td>" . htmlspecialchars($row['EntryDate']) . "</td>";
              echo "<td>" . htmlspecialchars($row['Material']) . "</td>";
              echo "</tr>";
          }
      } else {
          echo "<tr><td colspan='8'>No Inward transactions found.</td></tr>";
      }
      ?>
    </tbody>
  </table>
</section>

<section id="orders" style="margin-top: 50px;">
  <h2>Outward Transactions</h2>
  <table>
    <thead>
      <tr>
        <th>Outward ID</th>
        <th>Product Name</th>
        <th>HSN Code</th>
        <th>Receiver</th>
        <th>Quantity</th>
        <th>Cost</th>
        <th>Entry Date</th>
        <th>Material Type</th>
      </tr>
    </thead>
    <tbody>
      <!-- PHP code will fill this -->
      <?php
      $sql2 = "SELECT * FROM outwardtransactions ORDER BY EntryDate DESC";
      $result2 = $conn->query($sql2);

      if ($result2 && $result2->num_rows > 0) {
          while($row2 = $result2->fetch_assoc()) {
              echo "<tr>";
              echo "<td>" . htmlspecialchars($row2['OutwardID']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['ProductName']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['HSNCode']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['Receiver']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['Quantity']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['Cost']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['EntryDate']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['Material']) . "</td>";
              echo "</tr>";
          }
      } else {
          echo "<tr><td colspan='8'>No Outward transactions found.</td></tr>";
      }

      // Close connection
      $conn->close();
      ?>
    </tbody>
  </table>
</section>

<footer>
  <p>&copy; 2025 Brass Industries. All Rights Reserved.</p>
</footer>

</body>
</html>