<?php
/**
 * Dashboard Data Provider
 * Returns statistics and recent bills for dashboard
 */

session_start();
require_once 'db_connect.php';

// Check authentication
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    json_response(false, 'Not authenticated');
}

// Get statistics
$stats = [];

// Total users
$result = $conn->query("SELECT COUNT(*) as count FROM users");
$stats['total_users'] = $result->fetch_assoc()['count'];

// Total bills
$result = $conn->query("SELECT COUNT(*) as count FROM bills");
$stats['total_bills'] = $result->fetch_assoc()['count'];

// Unpaid bills
$result = $conn->query("SELECT COUNT(*) as count FROM bills WHERE status = 'unpaid'");
$stats['unpaid_bills'] = $result->fetch_assoc()['count'];

// Paid bills
$result = $conn->query("SELECT COUNT(*) as count FROM bills WHERE status = 'paid'");
$stats['paid_bills'] = $result->fetch_assoc()['count'];

// Get recent bills (last 10)
$sql = "SELECT b.*, u.name
        FROM bills b
        JOIN users u ON b.user_id = u.id
        ORDER BY b.created_at DESC
        LIMIT 10";
$result = $conn->query($sql);

$recent_bills = [];
while ($row = $result->fetch_assoc()) {
    $recent_bills[] = $row;
}

json_response(true, 'Dashboard data loaded', [
    'stats' => $stats,
    'recent_bills' => $recent_bills
]);

$conn->close();
?>
