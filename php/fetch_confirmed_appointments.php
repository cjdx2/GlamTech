<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glamtechdb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$date = $_GET['date'];

if (!$date) {
    echo json_encode([]);
    exit;
}

$query = "SELECT * FROM appointments WHERE date = ? AND status = 'Confirmed'";
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
