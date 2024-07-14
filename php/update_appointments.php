<?php
date_default_timezone_set('Asia/Manila'); // Set the desired time zone

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glamtechdb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$action = $data['action'];

if ($action === 'confirm') {
    $sql = "UPDATE appointments SET status='confirmed' WHERE id='$id'";
} elseif ($action === 'reject') {
    $sql = "UPDATE appointments SET status='rejected' WHERE id='$id'";
} elseif ($action === 'delete') {
    $sql = "UPDATE appointments SET status='deleted' WHERE id='$id'";
}

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$conn->close();
?>
