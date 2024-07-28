<?php
// Database connection parameters
$servername = "localhost";
$username = "root"; // Change to your database username
$password = ""; // Change to your database password
$dbname = "glamtechdb";

date_default_timezone_set('Asia/Manila');

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
    $stmt = $conn->prepare("INSERT INTO joane_feedback (user_name, star_rating, comment, date_time) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siss", $user_name, $star_rating, $comment, $date_time);

    if ($stmt->execute()) {
        echo "Feedback submitted successfully!";
        // Optionally, you can redirect the user or perform other actions here
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

// Fetch feedback from the database
$sql = "SELECT * FROM joane_feedback ORDER BY date_time DESC";
$result = $conn->query($sql);

$feedbacks = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Format the date and time for display
        $row['date_time'] = date('F j, Y, g:i a', strtotime($row['date_time']));
        $feedbacks[] = $row;
    }
}
// Output the feedbacks in JSON format
echo json_encode($feedbacks);

// Close the database connection
$conn->close();
?>
