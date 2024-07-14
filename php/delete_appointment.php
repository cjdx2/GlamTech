<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];

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

    // Delete the appointment
    $query = "DELETE FROM appointments WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Appointment deleted.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No appointment found with that ID']);
    }

    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
