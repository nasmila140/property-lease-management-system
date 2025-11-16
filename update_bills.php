<?php
/**
 * Update Bill Handler
 * Updates existing bill record in database
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
    $bill_id = sanitize_input($_POST['bill_id']);
    $rent = sanitize_input($_POST['rent']);
    $water_bill = sanitize_input($_POST['water_bill']);
    $sewage_bill = sanitize_input($_POST['sewage_bill']);
    $status = sanitize_input($_POST['status']);

    // Validate input
    if (empty($bill_id)) {
        json_response(false, 'Bill ID is required');
    }

    // Validate numeric values
    if (!is_numeric($rent) || !is_numeric($water_bill) || !is_numeric($sewage_bill)) {
        json_response(false, 'Invalid numeric values');
    }

    // Calculate total
    $total = floatval($rent) + floatval($water_bill) + floatval($sewage_bill);

    // Prepare SQL statement
    $stmt = $conn->prepare("UPDATE bills SET rent = ?, water_bill = ?, sewage_bill = ?, total = ?, status = ? WHERE id = ?");
    $stmt->bind_param("ddddsi", $rent, $water_bill, $sewage_bill, $total, $status, $bill_id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            json_response(true, 'Bill updated successfully');
        } else {
            json_response(false, 'No changes made or bill not found');
        }
    } else {
        json_response(false, 'Failed to update bill: ' . $stmt->error);
    }

    $stmt->close();
} else {
    json_response(false, 'Invalid request method');
}

$conn->close();
?>
