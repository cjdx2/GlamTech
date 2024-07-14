<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $status = $data['status'];
    $email = $data['email'];
    $name = $data['name'];
    $appointmentDate = $data['date'];
    $appointmentTime = $data['time'];

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

    // Update appointment status
    $query = "UPDATE appointments SET status = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('si', $status, $id);
    if ($stmt->execute()) {
        // Prepare email
        $subject = 'Appointment Confirmation';
        $message = "Dear $name,\n\nYour appointment on $appointmentDate at $appointmentTime has been confirmed.\n\nThank you.";
        $headers = "From: glamtechsia@gmail.com\r\n" .
                   "Reply-To: glamtechsia@gmail.com\r\n" .
                   "X-Mailer: PHP/" . phpversion();

        // Send email
        if (mail($email, $subject, $message, $headers)) {
            echo json_encode(['status' => 'success', 'message' => 'Appointment updated and email sent.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to send email']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update appointment']);
    }

    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
