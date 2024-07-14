<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glamtechdb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $star_rating = $_POST['rating'];
    $comment = $_POST['comment'];
    $date_time = date('Y-m-d H:i:s');
    $user_id = $_SESSION['user_id'];
    $username = $_SESSION['username'];
    $profile_picture = $_SESSION['profile_picture'];

    $stmt = $conn->prepare("INSERT INTO jirven_feedback (user_id, username, profile_picture, star_rating, comment, date_time) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ississ", $user_id, $username, $profile_picture, $star_rating, $comment, $date_time);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'feedback' => [
                'user_id' => $user_id,
                'username' => $username,
                'profile_picture' => $profile_picture,
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
