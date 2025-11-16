<?php
/**
 * Login Authentication Handler
 * Validates admin credentials and creates session
 */

session_start();
require_once 'db_connect.php';

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get and sanitize input
    $username = sanitize_input($_POST['username']);
    $password = $_POST['password'];

    // Validate input
    if (empty($username) || empty($password)) {
        json_response(false, 'Please fill in all fields');
    }

    // Prepare SQL statement
    $stmt = $conn->prepare("SELECT id, username, password FROM admins WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $admin = $result->fetch_assoc();

        // Verify password
        if (password_verify($password, $admin['password'])) {
            // Set session variables
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            $_SESSION['logged_in'] = true;

            json_response(true, 'Login successful', [
                'username' => $admin['username']
            ]);
        } else {
            json_response(false, 'Invalid username or password');
        }
    } else {
        json_response(false, 'Invalid username or password');
    }

    $stmt->close();
} else {
    json_response(false, 'Invalid request method');
}

$conn->close();
?>
