<?php
session_start();

$response = array();

if (isset($_SESSION['username']) && isset($_SESSION['profile_picture'])) {
    $response['username'] = $_SESSION['username'];
    $response['profile_picture'] = $_SESSION['profile_picture'];
} else {
    $response['error'] = "User session data not found.";
}

echo json_encode($response);
?>
