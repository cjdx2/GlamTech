<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "account";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $star_rating = $_POST['rating'];
    $comment = $_POST['comment'];
    $date_time = date('Y-m-d H:i:s');
    $user_name = 'Anonymous';

    $stmt = $conn->prepare("INSERT INTO jirven_feedback (user_name, star_rating, comment, date_time) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siss", $user_name, $star_rating, $comment, $date_time);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'feedback' => [
                'user_name' => $user_name,
                'star_rating' => $star_rating,
                'comment' => $comment,
                'date_time' => $date_time
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
