<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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

// Retrieve the selected date from the query parameters
$date = isset($_GET['date']) ? $_GET['date'] : '';

if ($date) {
    $sql = "SELECT id, staff, service, amount, commission, datetime FROM logbook WHERE DATE(datetime) = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $date);
} else {
    $sql = "SELECT id, staff, service, amount, commission, datetime FROM logbook";
    $stmt = $conn->prepare($sql);
}

$stmt->execute();
$result = $stmt->get_result();

$entries = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $entries[] = $row;
    }
}

$stmt->close();
$conn->close();

echo json_encode($entries);
?>
