<?php
/**
 * Get All Users
 * Returns list of all tenants
 */

session_start();
require_once 'db_connect.php';

// Check authentication
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    json_response(false, 'Not authenticated');
}

// Get all users
$sql = "SELECT id, name, contact, email FROM users ORDER BY name ASC";
$result = $conn->query($sql);

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

json_response(true, 'Users loaded', $users);

$conn->close();
?>
