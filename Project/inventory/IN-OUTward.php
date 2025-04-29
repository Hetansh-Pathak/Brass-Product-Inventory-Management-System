<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Inventory Management</title>
  <link rel="stylesheet" href="../inventory/inventory1.css" />
  <style>
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
    <h1>Inventory Management</h1>
    <nav>
      <ul>
        <li><a href="../first_page/firstpage.php">Home</a></li>
        <li><a href="../orders/orders.php">Orders</a></li>
        <li><a href="../inventory/inventory.html">Inventory</a></li>
        <li><a href="../Available_material/available_material.html">Available-Raw-Material</a></li>
        <li><a href="#available-stock" class="active">Managing-Stock</a></li>
        <li><a href="../billing/billing.html">Billing</a></li>
      </ul>
    </nav>
  </header>

  <!-- 🔍 Search Bar -->
  <div class="search-container">
    <input type="text" id="searchInput" placeholder="Search by Product Name..." onkeyup="filterTables()">
  </div>

  <!-- 🟢 INWARD TABLE -->
  <section id="Inward">
    <h2>Inward</h2>
    <table id="inwardTable">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>From</th>
          <th>HSN Code</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Date</th>
          <th>Material</th>
        </tr>
      </thead>
      <tbody>
      <?php
      $host = "localhost";
      $dbUser = "root";
      $dbPass = "";
      $dbName = "my_database";
      $dbPort = 8000;

      $conn = new mysqli($host, $dbUser, $dbPass, $dbName, $dbPort);
      if ($conn->connect_error) {
          die("Connection failed: " . $conn->connect_error);
      }

      $sql = "SELECT * FROM inwardtransactions ORDER BY EntryDate DESC";
      $result = $conn->query($sql);

      if ($result && $result->num_rows > 0) {
          while($row = $result->fetch_assoc()) {
              echo "<tr>";
              echo "<td>" . htmlspecialchars($row['ProductName']) . "</td>";
              echo "<td>" . htmlspecialchars($row['Sender']) . "</td>";
              echo "<td>" . htmlspecialchars($row['HSNCode']) . "</td>";
              echo "<td>" . htmlspecialchars($row['Quantity']) . "</td>";
              echo "<td>" . htmlspecialchars($row['Price']) . "</td>";
              echo "<td>" . htmlspecialchars($row['EntryDate']) . "</td>";
              echo "<td>" . htmlspecialchars($row['Material']) . "</td>";
              echo "</tr>";
          }
      } else {
          echo "<tr><td colspan='7'>No Inward transactions found.</td></tr>";
      }
      ?>
      </tbody>
    </table>
  </section>

  <!-- 🔵 OUTWARD TABLE -->
  <section id="Outward">
    <h2>Outward</h2>
    <table id="outwardTable">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>HSN Code</th>
          <th>Receiver</th>
          <th>Quantity</th>
          <th>Cost</th>
          <th>Date</th>
          <th>Material</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      <?php
      $sql2 = "SELECT * FROM outwardtransactions ORDER BY EntryDate DESC";
      $result2 = $conn->query($sql2);

      if ($result2 && $result2->num_rows > 0) {
          while($row2 = $result2->fetch_assoc()) {
              echo "<tr>";
              echo "<td>" . htmlspecialchars($row2['ProductName']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['HSNCode']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['Receiver']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['Quantity']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['Cost']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['EntryDate']) . "</td>";
              echo "<td>" . htmlspecialchars($row2['Material']) . "</td>";
              echo "<td><button onclick=\"deleteRow(this)\">Delete</button></td>";
              echo "</tr>";
          }
      } else {
          echo "<tr><td colspan='8'>No Outward transactions found.</td></tr>";
      }

      $conn->close();
      ?>
      </tbody>
    </table>
  </section>

  <script>
    function deleteRow(btn) {
      const row = btn.closest("tr");
      row.remove();
    }

    function filterTables() {
      const searchValue = document.getElementById("searchInput").value.toLowerCase();
      filterTable('inwardTable', searchValue, 0);
      filterTable('outwardTable', searchValue, 0);
    }

    function filterTable(tableId, value, columnIndex) {
      const rows = document.getElementById(tableId).querySelectorAll("tbody tr");
      rows.forEach(row => {
        const cell = row.cells[columnIndex];
        let text = "";

        if (cell) {
          const input = cell.querySelector("input");
          if (input) {
            text = input.value.toLowerCase();
          } else {
            text = cell.innerText.toLowerCase(); // This line ensures plain text works
          }
        }

        row.style.display = text.includes(value) ? "" : "none";
      });
    }
  </script>
</body>
</html>
