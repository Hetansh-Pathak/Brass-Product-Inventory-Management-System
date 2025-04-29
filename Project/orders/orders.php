<?php
// DB Connection
$conn = new mysqli("localhost", "root", "", "my_database", 8000);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// ADD ORDER
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add'])) {
    $orderID = intval($_POST['order_id']);
    $customerName = $_POST['customer_name'];
    $product = $_POST['product'];
    $quantity = $_POST['quantity'];
    $status = $_POST['status'];
    $orderDate = date('Y-m-d'); // current date

    $stmt = $conn->prepare("INSERT INTO orders (OrderID, CustomerName, Product, Quantity, Status, OrderDate) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ississ", $orderID, $customerName, $product, $quantity, $status, $orderDate);
    $stmt->execute();
    $stmt->close();
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

// DELETE ORDER
if (isset($_GET['delete'])) {
    $orderID = intval($_GET['delete']);
    $conn->query("DELETE FROM orders WHERE OrderID = $orderID");
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Order Management</title>
    <style>
        body {
            font-family: Arial;
        }
        table {
            width: 95%;
            margin: auto;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px;
            border: 1px solid #ccc;
            text-align: center;
        }
        th {
            background: #2c3e50;
            color: white;
        }
        .actions {
            display: flex;
            justify-content: space-evenly;
        }
        .actions form, .actions a {
            width: 48%;
        }
        .add-btn, .delete-btn {
            width: 100%;
            padding: 5px;
            border: none;
            color: white;
            cursor: pointer;
            font-weight: bold;
            border-radius: 5px;
        }
        .add-btn {
            background-color: #3498db;
        }
        .delete-btn {
            background-color: #e74c3c;
        }
        .add-form input, .add-form select {
            padding: 5px;
            width: 90%;
        }

        header {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            /* display: block; */
            /* justify-content: center; */
            /* flex: auto; */
            margin-top: -10px;
            margin-left: -10px;
            width: 100%;
            text-align: center;
        }

        nav ul {
            display: flex;
            justify-content: center;
            list-style: none;
            padding: 10px;
            background: #34495e;
        }

        nav ul li {
            margin: 0 15px;
        }

        nav ul li a {
            text-decoration: none;
            color: white;
            font-size: 18px;
            padding: 10px 15px;
            transition: 0.3s;
        }
        nav ul li a:hover, .active {
            background-color: #f39c12;
            border-radius: 5px;
        }

        .top-search-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 15px;
        background-color: #f4f4f4;
        border-bottom: 1px solid #ddd;
      }
      
      .top-search-bar input[type="text"] {
        width: 300px;
        padding: 8px 12px;
        font-size: 16px;
        border-radius: 6px;
        border: 1px solid #ccc;
        margin-right: 10px;
      }
      
      .top-search-bar button {
        padding: 8px 16px;
        font-size: 16px;
        background-color: #0077cc;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
      
      .top-search-bar button:hover {
        background-color: #005fa3;
      }
      tr.highlight {
        background-color: #ffff99;
      }

    </style>
    <script>
        function confirmDelete(orderID) {
            if (confirm("Are you sure you want to delete this order?")) {
                window.location.href = '?delete=' + orderID;
            }
        }
    </script>
</head>
<body>

<header>
    <h1>Inventory-management</h1>
    <nav>
      <ul>
        <li><a href="../first_page/firstpage.php">Home</a></li>
        <li><a href="../orders/orders.php" class="active">Orders</a></li>
        <li><a href="../inventory/inventory.html">Product-management</a></li>
        <li><a href="../Available_material/available_material.html">Raw_material-management</a></li>
        <li><a href="../inventory/IN-OUTward.php">IN/OUT</a></li>
        <li><a href="../billing/billing.html">Billing</a></li>
      </ul>
    </nav>
  </header>

 



<h2 style="text-align:center; margin-top:20px;">Order Details</h2>

<table>
    <thead>
        <tr>
            <th>OrderID</th>
            <th>Customer Name</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <!-- Existing Orders -->
        <?php
        $result = $conn->query("SELECT * FROM orders ORDER BY OrderID DESC");
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>
                        <td>{$row['OrderID']}</td>
                        <td>{$row['CustomerName']}</td>
                        <td>{$row['Product']}</td>
                        <td>{$row['Quantity']}</td>
                        <td>{$row['Status']}</td>
                        <td>{$row['OrderDate']}</td>
                        <td class='actions'>
                            <form method='post' action='' style='display:inline-block;'>
                                <button type='button' class='delete-btn' onclick='confirmDelete({$row['OrderID']})'>Delete</button>
                            </form>
                        </td>
                      </tr>";
            }
        } else {
            echo "<tr><td colspan='7'>No orders yet.</td></tr>";
        }
        ?>
        <!-- Add New Order Row -->
        <tr class="add-form">
            <form method="post" action="">
                <td><input type="number" name="order_id" required></td>
                <td><input type="text" name="customer_name" required></td>
                <td><input type="text" name="product" required></td>
                <td><input type="number" name="quantity" min="1" required></td>
                <td>
                    <select name="status" required>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                    </select>
                </td>
                <td>Auto</td>
                <td class="actions">
                    <button type="submit" name="add" class="add-btn">Add</button>
                </td>
            </form>
        </tr>
    </tbody>
</table>

</body>
</html>

<?php $conn->close(); ?>
