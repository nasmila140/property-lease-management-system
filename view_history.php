<?php
/**
 * View Payment History Handler
 * Returns filtered payment history with summary
 */

session_start();
require_once 'db_connect.php';

// Check authentication
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    json_response(false, 'Not authenticated');
}

// Build WHERE clause based on filters
$where_conditions = [];
$params = [];
$types = '';

if (!empty($_GET['user_id'])) {
    $where_conditions[] = "b.user_id = ?";
    $params[] = $_GET['user_id'];
    $types .= 'i';
}

if (!empty($_GET['status'])) {
    $where_conditions[] = "b.status = ?";
    $params[] = $_GET['status'];
    $types .= 's';
}

if (!empty($_GET['year'])) {
    $where_conditions[] = "b.year = ?";
    $params[] = $_GET['year'];
    $types .= 'i';
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get filtered bills
$sql = "SELECT b.*, u.name, u.contact
        FROM bills b
        JOIN users u ON b.user_id = u.id
        $where_clause
        ORDER BY b.year DESC, b.month DESC, b.created_at DESC";

$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$bills = [];
while ($row = $result->fetch_assoc()) {
    $bills[] = $row;
}

// Calculate summary statistics
$summary = [
    'total_records' => count($bills),
    'total_amount' => 0,
    'paid_amount' => 0,
    'unpaid_amount' => 0
];

foreach ($bills as $bill) {
    $amount = floatval($bill['total']);
    $summary['total_amount'] += $amount;

    if ($bill['status'] === 'paid') {
        $summary['paid_amount'] += $amount;
    } else {
        $summary['unpaid_amount'] += $amount;
    }
}

json_response(true, 'Payment history loaded', [
    'bills' => $bills,
    'summary' => $summary
]);

$stmt->close();
$conn->close();
?>
