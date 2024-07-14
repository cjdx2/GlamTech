<?php
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

// Read JSON input from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate and sanitize input
if (isset($data['id'], $data['staff'], $data['service'], $data['amount'], $data['commission'], $data['time'])) {
    $id = $data['id'];
    $staff = $data['staff'];
    $service = $data['service'];
    $amount = $data['amount'];
    $commission = $data['commission'];
    $time = $data['time'];

    // Prepare and bind parameters to update statement
    $updateSql = "UPDATE logbook SET staff = ?, service = ?, amount = ?, commission = ?, time = ? WHERE id = ?";
    $stmt = $conn->prepare($updateSql);

    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("ssddsi", $staff, $service, $amount, $commission, $time, $id);

    // Execute the statement
    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "error";
    }

    $stmt->close();
} else {
    echo "Invalid input";
}

$conn->close();
?>
