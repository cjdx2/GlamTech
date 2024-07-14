<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT id, password, profile_picture FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if ($password === $user['password']) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $username;
            $_SESSION['profile_picture'] = $user['profile_picture'];

            if ($username === 'glamtech') {
                header("Location: ../html/adminhome.html");
            } else {
                header("Location: ../html/homepage.html");
            }
        } else {
            echo "<script>alert('Incorrect password.'); window.location.href = '../html/login.html';</script>";
        }
    } else {
        echo "<script>alert('Username not found.'); window.location.href = '../html/login.html';</script>";
    }

    $stmt->close();
    $conn->close();
}
?>
