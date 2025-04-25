<?php
// Database configuration
// $host = "localhost";
// $dbUser = "root";
// // $dbPass = "ce174";
// $dbPass = "";
// $dbName = "my_database";
// // $dbPort = 3307;
// $dbPort = 8000;

// // Create connection
// $conn = new mysqli($host, $dbUser, $dbPass, $dbName, $dbPort);

// // Check connection
// if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
// }

// // Get form values
// $username = $_POST['username'] ?? '';
// $email = $_POST['email'] ?? '';
// $password = $_POST['password'] ?? '';

// // Simple validation
// if (empty($username) || empty($email) || empty($password)) {
//     die("All fields are required.");
// }

// // Optional: Hash the password for security
// $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// // Prepare and bind
// $stmt = $conn->prepare("INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())");
// $stmt->bind_param("sss", $username, $email, $hashedPassword);

// // Execute and check
// if ($stmt->execute()) {
//     // Redirect to dashboard
//     header("Location: ../first_page/firstpage.html");
//     exit();
// } else {
//     echo "Error: " . $stmt->error;
// }

// // Close connection
// $stmt->close();
// $conn->close();
?>

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
?>
