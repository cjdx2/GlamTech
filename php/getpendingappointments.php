<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glamtechdb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$month = isset($_GET['month']) ? intval($_GET['month']) : date('m');
$year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');

// Query to fetch pending appointments count for each date in the given month and year
$sql = "SELECT DATE(date) as appointment_date, COUNT(*) as pending_count 
        FROM appointments 
        WHERE MONTH(date) = ? AND YEAR(date) = ? AND status = 'pending'
        GROUP BY DATE(date)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $month, $year);
$stmt->execute();
$result = $stmt->get_result();

$pendingAppointments = [];
while ($row = $result->fetch_assoc()) {
    $pendingAppointments[$row['appointment_date']] = $row['pending_count'];
}

$stmt->close();
$conn->close();

echo json_encode($pendingAppointments);
?>
