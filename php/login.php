<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $_SESSION['username'] = $username;
        $stmt->close();
        $conn->close();
        
        // Check if the username is "admin"
        if ($username === 'glamtech') {
            header("Location: ../html/adminhome.html");
        } else {
            header("Location: ../html/homepage.html");
        }
        exit();
    } else {
        $stmt->close();
        $conn->close();
        
        // Redirect to login page
        header("Location: ../html/login.html");
        exit();
    }
}
?>