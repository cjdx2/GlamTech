<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glamtechdb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT f.user_id, f.star_rating, f.comment, f.date_time, u.profile_picture
        FROM jirven_feedback f
        JOIN users u ON f.user_id = u.id
        ORDER BY f.date_time DESC";
$result = $conn->query($sql);

$feedbacks = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $feedbacks[] = $row;
    }
}

echo json_encode($feedbacks);

$conn->close();
?>
