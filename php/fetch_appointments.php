<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glamtechdb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$date = $_GET['date'] ?? date('Y-m-d');

$query = "SELECT id, firstname, lastname, email, usercontact, service, date, time, staff, status FROM appointments WHERE date = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('s', $date);
$stmt->execute();
$result = $stmt->get_result();

$appointments = [];
while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode($appointments);

$stmt->close();
$conn->close();
?>
