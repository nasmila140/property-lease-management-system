<?php
/**
 * Session Checker
 * Verifies if admin is logged in
 */

session_start();

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    json_response(false, 'Not authenticated');
}

json_response(true, 'Authenticated', [
    'username' => $_SESSION['admin_username']
]);
?>
