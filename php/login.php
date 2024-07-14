<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username = ? AND password = ?";  // Compare plain text password
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("ss", $username, $password);  // Compare plain text password
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $username;

        if ($username === 'glamtech') {
            header("Location: ../html/adminhome.html");
        } else {
            header("Location: ../html/homepage.html");
        }
    } else {
        echo "<script>alert('Incorrect username or password.'); window.location.href = '../html/login.html';</script>";
    }

    $stmt->close();
    $conn->close();
}
?>
