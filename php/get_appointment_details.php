<?php
// Enable error reporting for development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glamtechdb";

// Create a new MySQLi connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection was successful
if ($conn->connect_error) {
    // If there was an error, send a JSON response with the error message
    echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// Fetch data from the POST request
$data = json_decode(file_get_contents('php://input'), true);

// Check if the data and id are provided
if (isset($data['id'])) {
    $id = $data['id'];

    // Prepare the SQL statement
    $query = "SELECT * FROM appointments WHERE id = ?";
    $stmt = $conn->prepare($query);

    if ($stmt) {
        // Bind the ID parameter and execute the statement
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Fetch the appointment details as an associative array
        $appointment = $result->fetch_assoc();

        // Check if the appointment exists and send a JSON response
        if ($appointment) {
            echo json_encode($appointment);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No appointment found with the provided ID']);
        }

        // Close the statement
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare the SQL statement']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'ID not provided']);
}

// Close the database connection
$conn->close();
?>
