<?php
/**
 * Search Bill Handler
 * Searches for a specific bill by user and month
 */

session_start();
require_once 'db_connect.php';

// Check authentication
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    json_response(false, 'Not authenticated');
}

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get and sanitize input
    $user_id = sanitize_input($_POST['user_id']);
    $month = sanitize_input($_POST['month']);
    $year = sanitize_input($_POST['year']);

    // Validate input
    if (empty($user_id) || empty($month) || empty($year)) {
        json_response(false, 'Please fill in all fields');
    }

    // Prepare SQL statement
    $stmt = $conn->prepare("SELECT b.*, u.name FROM bills b JOIN users u ON b.user_id = u.id WHERE b.user_id = ? AND b.month = ? AND b.year = ?");
    $stmt->bind_param("iss", $user_id, $month, $year);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $bill = $result->fetch_assoc();
        json_response(true, 'Bill found', $bill);
    } else {
        json_response(false, 'No bill found for selected tenant and month');
    }

    $stmt->close();
} else {
    json_response(false, 'Invalid request method');
}

$conn->close();
?>
