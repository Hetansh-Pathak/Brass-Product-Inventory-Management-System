<?php
// // DB Connection
// $conn = new mysqli("localhost", "root", "", "my_database", 8000);
// if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
// }

// ADD ORDER
// if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add'])) {
//     $orderID = intval($_POST['order_id']);
//     $customerName = $_POST['customer_name'];
//     $product = $_POST['product'];
//     $quantity = $_POST['quantity'];
//     $status = $_POST['status'];
//     $orderDate = date('Y-m-d'); // current date

//     $stmt = $conn->prepare("INSERT INTO orders (OrderID, CustomerName, Product, Quantity, Status, OrderDate) VALUES (?, ?, ?, ?, ?, ?)");
//     $stmt->bind_param("ississ", $orderID, $customerName, $product, $quantity, $status, $orderDate);
//     $stmt->execute();
//     $stmt->close();
//     header("Location: " . $_SERVER['PHP_SELF']);
//     exit;
// }

// // DELETE ORDER
// if (isset($_GET['delete'])) {
//     $orderID = intval($_GET['delete']);
//     $conn->query("DELETE FROM orders WHERE OrderID = $orderID");
//     header("Location: " . $_SERVER['PHP_SELF']);
//     exit;
// }
?>

<!-- <!DOCTYPE html>
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
    <tbody> -->
        <!-- Existing Orders -->
        <?php
        // $result = $conn->query("SELECT * FROM orders ORDER BY OrderID DESC");
        // if ($result->num_rows > 0) {
        //     while($row = $result->fetch_assoc()) {
        //         echo "<tr>
        //                 <td>{$row['OrderID']}</td>
        //                 <td>{$row['CustomerName']}</td>
        //                 <td>{$row['Product']}</td>
        //                 <td>{$row['Quantity']}</td>
        //                 <td>{$row['Status']}</td>
        //                 <td>{$row['OrderDate']}</td>
        //                 <td class='actions'>
        //                     <form method='post' action='' style='display:inline-block;'>
        //                         <button type='button' class='delete-btn' onclick='confirmDelete({$row['OrderID']})'>Delete</button>
        //                     </form>
        //                 </td>
        //               </tr>";
        //     }
        // } else {
        //     echo "<tr><td colspan='7'>No orders yet.</td></tr>";
        // }
        ?>
        <!-- Add New Order Row -->
        <!-- <tr class="add-form">
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
</html> -->

<?php $conn->close(); ?>











<?php
require 'order.php'; // Use your DB connection file

// ADD ORDER
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add'])) {
    $orderID = intval($_POST['order_id']);
    $customerName = $_POST['customer_name'];
    $product = $_POST['product'];
    $quantity = $_POST['quantity'];
    $status = $_POST['status'];
    $orderDate = date('Y-m-d');
    $stmt = $conn->prepare("INSERT INTO orders (OrderID, CustomerName, Product, Quantity, Status, OrderDate) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ississ", $orderID, $customerName, $product, $quantity, $status, $orderDate);
    $stmt->execute();
    $stmt->close();
    header("Location: orders.html");
    exit;
}

// DELETE ORDER
if (isset($_GET['delete'])) {
    $orderID = intval($_GET['delete']);
    $conn->query("DELETE FROM orders WHERE OrderID = $orderID");
    header("Location: orders.html");
    exit;
}

// FETCH ORDERS FOR DISPLAY (if you want to render rows server-side)
$result = $conn->query("SELECT * FROM orders");
while ($row = $result->fetch_assoc()) {
    echo "<tr>
        <td>{$row['OrderID']}</td>
        <td>{$row['CustomerName']}</td>
        <td>{$row['Product']}</td>
        <td>{$row['Quantity']}</td>
        <td>{$row['Status']}</td>
        <td>
            <a href='orders.php?delete={$row['OrderID']}' class='delete-btn'>Delete</a>
        </td>
    </tr>";
}
$conn->close();
?>
