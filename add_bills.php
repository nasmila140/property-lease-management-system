<?php
/**
 * Add New Bill Handler
 * Inserts new bill record into database
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
    $rent = sanitize_input($_POST['rent']);
    $water_bill = sanitize_input($_POST['water_bill']);
    $sewage_bill = sanitize_input($_POST['sewage_bill']);
    $status = sanitize_input($_POST['status']);

    // Validate input
    if (empty($user_id) || empty($month) || empty($year)) {
        json_response(false, 'Please fill in all required fields');
    }

    // Validate numeric values
    if (!is_numeric($rent) || !is_numeric($water_bill) || !is_numeric($sewage_bill)) {
        json_response(false, 'Invalid numeric values');
    }

    // Calculate total
    $total = floatval($rent) + floatval($water_bill) + floatval($sewage_bill);

    // Check if bill already exists for this user and month
    $check_stmt = $conn->prepare("SELECT id FROM bills WHERE user_id = ? AND month = ? AND year = ?");
    $check_stmt->bind_param("iss", $user_id, $month, $year);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        json_response(false, 'Bill already exists for this tenant and month');
    }
    $check_stmt->close();

    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO bills (user_id, month, year, rent, water_bill, sewage_bill, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isiiddds", $user_id, $month, $year, $rent, $water_bill, $sewage_bill, $total, $status);

    if ($stmt->execute()) {
        json_response(true, 'Bill added successfully');
    } else {
        json_response(false, 'Failed to add bill: ' . $stmt->error);
    }

    $stmt->close();
} else {
    json_response(false, 'Invalid request method');
}

$conn->close();
?>
