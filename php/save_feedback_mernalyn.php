<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glamtechdb";

// Set the timezone to Philippines
date_default_timezone_set('Asia/Manila');

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function containsBannedWords($text) {
    $bannedWords = ['putang ina', 'gago', 'gaga', 'tangina', 'leche', 'bobo', 'ulol', 'tarantado', 'hayop ka', 'lintik', 'pakshet', 'burat', 'bwisit', 'kupal'];
    foreach ($bannedWords as $word) {
        if (stripos($text, $word) !== false) {
            return true;
        }
    }
    return false;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $star_rating = $_POST['rating'];
    $comment = $_POST['comment'];
    $date_time = date('Y-m-d H:i:s'); // Format the date and time
    $user_id = $_SESSION['user_id'];
    $username = $_SESSION['username'];
    $profile_picture = $_SESSION['profile_picture'];

    if (containsBannedWords($comment)) {
        echo json_encode(['success' => false, 'error' => 'Feedback contains inappropriate language.']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO mernalyn_feedback (user_id, username, profile_picture, star_rating, comment, date_time) VALUES (?, ?, ?, ?, ?, ?)");
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
                'date_time' => date('F j, Y, g:i a', strtotime($date_time)) // Format the date and time for JSON response
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
