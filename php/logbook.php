<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "root"; // Change to your database username
$password = ""; // Change to your database password
$dbname = "glamtechdb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $staff = $_POST['staff'];
    $service = $_POST['service'];
    $amount = intval($_POST['amount']);
    $commission = intval($_POST['commission']);
    $time = $_POST['time'];

    // Verify if all fields are set
    if (isset($staff, $service, $amount, $commission, $time)) {
        $insertSql = "INSERT INTO logbook (staff, service, amount, commission, time) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($insertSql);

        if ($stmt === false) {
            die("Error preparing statement: " . $conn->error);
        }

        $stmt->bind_param("ssiii", $staff, $service, $amount, $commission, $time);

        if ($stmt->execute()) {
            echo "<script>alert('Successfully saved!'); window.location.href = '../html/logbook.html';</script>";
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "All fields are required.";
    }
}

$conn->close();
?>
