<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glamtechdb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $username = $_POST['username'];
    $password = $_POST['password'];  // Remove password hashing
    $email = $_POST['email'];
    $phone = $_POST['phone'];

    $checkUsernameSql = "SELECT id FROM users WHERE username = ?";
    $stmt = $conn->prepare($checkUsernameSql);

    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo "<script>alert('Username already taken. Please choose another username.'); window.location.href = '../html/signup.html';</script>";
    } else {
        $stmt->close();

        $insertSql = "INSERT INTO users (firstname, lastname, username, password, email, phone) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($insertSql);

        if ($stmt === false) {
            die("Error preparing statement: " . $conn->error);
        }

        $stmt->bind_param("ssssss", $firstname, $lastname, $username, $password, $email, $phone);

        if ($stmt->execute()) {
            echo "<script>alert('Signup successful!'); window.location.href = '../html/login.html';</script>";
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    }

    $conn->close();
}
?>
