<?php

date_default_timezone_set('Asia/Manila'); // e.g., 'America/New_York'

error_reporting(E_ALL);
ini_set('display_errors', 1);


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "account";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the date from query parameters or default to today
$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');

// Prepare and bind
$stmt = $conn->prepare("SELECT * FROM appointments WHERE date = ? ");
$stmt->bind_param("s", $date);

// Execute the statement
$stmt->execute();
$result = $stmt->get_result();

$appointments = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $appointments[] = $row;
    }
}

// Close connections
$stmt->close();
$conn->close();

// Set content type header for JSON response
header('Content-Type: application/json');

// Return the appointments as JSON
echo json_encode($appointments);
?>
