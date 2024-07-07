<?php
$servername = "localhost";
$username = "root"; // Change to your database username
$password = ""; // Change to your database password
$dbname = "account";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM logbook ORDER BY created_at DESC";
$result = $conn->query($sql);

$entries = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $entries[] = $row;
    }
}

echo json_encode($entries);

$conn->close();
?>
