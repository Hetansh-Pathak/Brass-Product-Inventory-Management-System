<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Brass Industries | Home</title>
  <link rel="stylesheet" href="First.css" />
  <link rel="stylesheet" href="../darkmode.css"/>
  <style>
    .order-btn {
      margin: 10px 0;
      padding: 8px 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .delete-btn {
      background-color: #e74c3c;
      color: white;
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    /* Dashboard Styling */
    .dashboard {
      padding: 40px 20px;
      background-color: #f7f7f7;
    }
    .dashboard-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    .dashboard-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .dashboard-section h3 {
      margin-bottom: 15px;
      font-size: 20px;
      color: #333;
    }
    .dashboard-section table {
      width: 100%;
      border-collapse: collapse;
    }
    .dashboard-section table th,
    .dashboard-section table td {
      padding: 8px 10px;
      border: 1px solid #ddd;
      text-align: left;
    }
    .dashboard-section table th {
      background-color: #007bff;
      color: white;
    }
  </style>
</head>
<body>

<header>
  <div class="logo">
    <h1>Brass Industries</h1>
  </div>
</header>

<section class="hero">
  <div class="hero-content" style="color: black;">
    <h2>High-Quality Brass Products & Billing Management</h2>
    <p>We provide top-notch brass manufacturing and seamless billing solutions.</p>
    <a href="../first_page/firstpage.php" class="btn" style="background-color: rgb(255, 0, 255);">Home</a>
    <a href="../orders/orders.php" class="btn">View Orders</a>
    <a href="../inventory/inventory.html" class="btn secondary" style="background-color: blue;">Explore Inventory</a>
    <a href="../billing/billing.html" class="btn" style="background-color: #ff0000; color: white;">Go to Billing</a>
  </div>
</section>

<!-- Add Dashboard Below :  -->

<section class="dashboard">
  <h2 style="text-align:center;">Dashboard</h2>
  <div class="dashboard-container">

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
?>

    <!-- Orders Section -->
    <div class="dashboard-section">
      <h3>Orders</h3>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Product</th>
          </tr>
        </thead>
        <tbody id="ordersBody">
        <?php
      $orderSql = "SELECT CustomerName, Product FROM orders LIMIT 5";
      $orderResult = $conn->query($orderSql);

      if ($orderResult && $orderResult->num_rows > 0) {
        while($row = $orderResult->fetch_assoc()) {
          echo "<tr><td>" . htmlspecialchars($row['CustomerName']) . "</td><td>" . htmlspecialchars($row['Product']) . "</td></tr>";
        }
      } else {
        echo "<tr><td colspan='2'>No Orders Found</td></tr>";
      }
      ?>
        </tbody>
      </table>
    </div>

    <!-- Available Products Section -->
    <div class="dashboard-section">
      <h3>Available Products</h3>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody id="productsBody">
        <?php
      $productSql = "SELECT ProductName, Quantity FROM products LIMIT 5";
      $productResult = $conn->query($productSql);

      if ($productResult && $productResult->num_rows > 0) {
        while($row = $productResult->fetch_assoc()) {
          echo "<tr><td>" . htmlspecialchars($row['ProductName']) . "</td><td>" . htmlspecialchars($row['Quantity']) . "</td></tr>";
        }
      } else {
        echo "<tr><td colspan='2'>No Products Found</td></tr>";
      }
      ?>
        </tbody>
      </table>
    </div>

    <!-- Raw Materials Section -->
    <div class="dashboard-section">
      <h3>Raw Materials</h3>
      <table>
        <thead>
          <tr>
            <th>Material Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody id="rawMaterialBody">
        <?php
      $rawSql = "SELECT MaterialName, Quantity FROM rawmaterials LIMIT 5";
      $rawResult = $conn->query($rawSql);

      if ($rawResult && $rawResult->num_rows > 0) {
        while($row = $rawResult->fetch_assoc()) {
          echo "<tr><td>" . htmlspecialchars($row['MaterialName']) . "</td><td>" . htmlspecialchars($row['Quantity']) . "</td></tr>";
        }
      } else {
        echo "<tr><td colspan='2'>No Raw Materials Found</td></tr>";
      }
      ?>
        </tbody>
      </table>
    </div>

    <!-- Bills Section -->
    <div class="dashboard-section">
      <h3>Bills</h3>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody id="billsBody">
        <?php
      $billingSql = "SELECT CustomerName, Total FROM billing LIMIT 5";
      $billingResult = $conn->query($billingSql);

      if ($billingResult && $billingResult->num_rows > 0) {
        while($row = $billingResult->fetch_assoc()) {
          echo "<tr><td>" . htmlspecialchars($row['CustomerName']) . "</td><td>" . htmlspecialchars($row['TotalAmount']) . "</td></tr>";
        }
      } else {
        echo "<tr><td colspan='2'>No Bills Found</td></tr>";
      }
      ?>
        </tbody>
      </table>
    </div>
    <?php $conn->close(); ?>
  </div>
</section>

<!-- Add Dashboard Above :  -->

<section class="products">
  <h2>Our Brass Products</h2>
  <div class="product-list">
    <div class="product-item">
      <img src="../photos/rods.jpeg" alt="Brass Rod" />
      <h3>Brass Rods</h3>
      <p>Durable and high-quality brass rods used in various industries.</p>
    </div>
    <div class="product-item">
      <img src="../photos/sheets.jpeg" alt="Brass Sheet" />
      <h3>Brass Sheets</h3>
      <p>Precision-cut brass sheets for industrial and decorative use.</p>
    </div>
    <div class="product-item">
      <img src="../photos/fittings.jpeg" alt="Brass Fittings" />
      <h3>Brass Fittings</h3>
      <p>Corrosion-resistant brass fittings for plumbing and construction.</p>
    </div>
  </div>
</section>

<section class="services">
  <h2>Why Choose Us?</h2>
  <div class="service-list">
    <div class="service-item">
      <img src="../photos/premium.jpeg" alt="Quality" />
      <h3>Premium Quality</h3>
      <p>Best-in-class brass products for various industries.</p>
    </div>
    <div class="service-item">
      <img src="../photos/secure.png" alt="Secure" />
      <h3>Secure Billing</h3>
      <p>Efficient and error-free billing for all transactions.</p>
    </div>
    <div class="service-item">
      <img src="../photos/fast delivery.jpeg" alt="Delivery" />
      <h3>Fast Delivery</h3>
      <p>Timely and safe delivery of all brass products.</p>
    </div>
  </div>
</section>

<section class="contact">
  <h2>Get in Touch</h2>
  <p>Have any questions? Reach out to us for more details.</p>
  <form id="contactForm" onsubmit="return showPopup(event)">
    <input type="text" id="name" placeholder="Your Name" required />
    <input type="email" id="email" placeholder="Your Email" required />
    <textarea id="message" placeholder="Your Message" required></textarea>
    <button class="send-button">Send Message</button>
  </form>
</section>

<div id="popupNotification" class="popup">
  Thank you! Your message has been sent.
</div>

<footer>
  <p>&copy; 2025 Brass Industries. All Rights Reserved.</p>
</footer>

<button id="darkModeToggle" onclick="toggleDarkMode()" class="darkmode">Dark Mode</button>

<script>
  function addNewOrder() {
    const tbody = document.getElementById("orderTableBody");
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><input type="text" placeholder="Order ID"></td>
      <td><input type="text" placeholder="Customer Name"></td>
      <td><input type="text" placeholder="Product"></td>
      <td><input type="number" placeholder="Quantity"></td>
      <td>
        <select>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </td>
      <td><button onclick="deleteOrder(this)" class="delete-btn">Delete</button></td>
    `;

    tbody.appendChild(row);
  }

  function deleteOrder(button) {
    const row = button.closest("tr");
    row.remove();
  }

  function showPopup(event) {
    event.preventDefault();
    const popup = document.getElementById("popupNotification");
    popup.style.display = "block";
    setTimeout(() => {
      popup.style.display = "none";
    }, 3000);
    document.getElementById("contactForm").reset();
    return false;
  }

  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
  }
</script>

</body>
</html>