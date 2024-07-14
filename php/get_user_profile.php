<?php
session_start();
include 'db.php';

$userid = $_SESSION['user_id'];
$sql = "SELECT firstname, lastname, username, password, email, phone, profile_picture FROM users WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userid);
$stmt->execute();
$result = $stmt->get_result();

$response = array();
if ($result->num_rows > 0) {
    $response = $result->fetch_assoc();
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
