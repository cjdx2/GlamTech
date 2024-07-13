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

// Get the year and month from query parameters
$year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');
$month = isset($_GET['month']) ? intval($_GET['month']) : date('m');

// Calculate the first and last day of the month
$first_day = "$year-$month-01";
$last_day = date("Y-m-t", strtotime($first_day));

// Prepare and bind
$stmt = $conn->prepare("SELECT * FROM appointments WHERE date BETWEEN ? AND ?");
$stmt->bind_param("ss", $first_day, $last_day);

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
