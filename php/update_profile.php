<?php
session_start();
include 'db.php';

$response = array('success' => false);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userid = $_SESSION['user_id'];
    $firstname = $_POST['first-name'];
    $lastname = $_POST['last-name'];
    $username = $_POST['username'];
    $password = $_POST['password'];  // Remove password hashing
    $email = $_POST['email'];
    $phone = $_POST['phone-number'];


    $passwordPattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/';
    if (!preg_match($passwordPattern, $password)) {
        $response['message'] = 'Password does not meet the required criteria.';
        echo json_encode($response);
        exit;
    }

    $profilePicture = null;
    if (isset($_FILES['profile-picture']) && $_FILES['profile-picture']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['profile-picture']['tmp_name'];
        $fileName = $_FILES['profile-picture']['name'];
        $fileSize = $_FILES['profile-picture']['size'];
        $fileType = $_FILES['profile-picture']['type'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));

        $allowedfileExtensions = array('jpg', 'gif', 'png');
        if (in_array($fileExtension, $allowedfileExtensions)) {
            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
            $uploadFileDir = '../uploads/';
            $dest_path = $uploadFileDir . $newFileName;

            if (!is_dir($uploadFileDir)) {
                mkdir($uploadFileDir, 0777, true);
            }

            if (is_writable($uploadFileDir)) {
                if (move_uploaded_file($fileTmpPath, $dest_path)) {
                    $profilePicture = $dest_path;
                } else {
                    $response['message'] = 'There was an error moving the uploaded file.';
                }
            } else {
                $response['message'] = 'Upload directory is not writable.';
            }
        } else {
            $response['message'] = 'Upload failed. Allowed file types: ' . implode(',', $allowedfileExtensions);
        }
    }

    $sql = "UPDATE users SET firstname=?, lastname=?, username=?, password=?, email=?, phone=?, profile_picture=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        $response['message'] = "Error preparing statement: " . $conn->error;
    } else {
        if ($profilePicture) {
            $stmt = $conn->prepare("UPDATE users SET firstname = ?, lastname = ?, username = ?, password = ?, email = ?, phone = ?, profile_picture = ? WHERE id = ?");
            $stmt->bind_param("sssssssi", $firstname, $lastname, $username, $password, $email, $phone, $profilePicture, $userid);
        } else {
            $stmt = $conn->prepare("UPDATE users SET firstname = ?, lastname = ?, username = ?, password = ?, email = ?, phone = ? WHERE id = ?");
            $stmt->bind_param("ssssssi", $firstname, $lastname, $username, $password, $email, $phone, $userid);
        }

        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['message'] = "Error updating profile: " . $stmt->error;
        }

        $stmt->close();
    }
}

$conn->close();
echo json_encode($response);
?>
