<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glamtechdb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Enable error logging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'], $data['staff'], $data['service'], $data['amount'], $data['commission'], $data['datetime'])) {
    $id = $data['id'];
    $staff = $data['staff'];
    $service = $data['service'];
    $amount = $data['amount'];
    $commission = $data['commission'];
    $datetime = $data['datetime'];

    $updateSql = "UPDATE logbook SET staff = ?, service = ?, amount = ?, commission = ?, datetime = ? WHERE id = ?";
    $stmt = $conn->prepare($updateSql);

    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("ssddsi", $staff, $service, $amount, $commission, $datetime, $id);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "error: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Invalid input";
}

$conn->close();
?>
