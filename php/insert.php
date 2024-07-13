<?php
// Database connection parameters
$servername = "localhost";
$username = "root"; // Change to your database username
$password = ""; // Change to your database password
$dbname = "account";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handling form submission to insert feedback into the database
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $star_rating = $_POST['rating'];
    $comment = $_POST['comment'];
    $date_time = $_POST['date_time'];

    // Set user name as 'Anonymous' for now
    $user_name = 'Anonymous';

    // Prepare SQL statement to insert feedback into the table
    $stmt = $conn->prepare("INSERT INTO feedback (user_name, star_rating, comment, date_time) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siss", $user_name, $star_rating, $comment, $date_time);

    if ($stmt->execute()) {
        echo "Feedback submitted successfully!";
        // Optionally, you can redirect the user or perform other actions here
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

// Close the database connection
$conn->close();
?>
