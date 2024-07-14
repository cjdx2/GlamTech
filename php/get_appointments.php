<?php

date_default_timezone_set('Asia/Manila'); // e.g., 'America/New_York'

error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// Check if form data is received
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstname = $conn->real_escape_string($_POST['firstname']);
    $lastname = $conn->real_escape_string($_POST['lastname']);
    $email = $conn->real_escape_string($_POST['email']);
    $usercontact = $conn->real_escape_string($_POST['usercontact']);
    $date = $conn->real_escape_string($_POST['date']);
    $time = $conn->real_escape_string($_POST['time']);

    // Get services from POST array
    $services = isset($_POST['services']) ? implode(',', $_POST['services']) : '';

    $sql = "INSERT INTO appointments (firstname, lastname, email, usercontact, service, date, time) 
            VALUES ('$firstname', '$lastname', '$email', '$usercontact', '$services', '$date', '$time')";

    if ($conn->query($sql) === TRUE) {
        echo "Appointment booked successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
