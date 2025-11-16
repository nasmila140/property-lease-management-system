<?php
// Run-once script to insert an admin user into the database

$host = "localhost";
$user = "root";       // change if needed
$pass = "";           // change if needed
$db   = "rental_management";

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Username and password to insert
$username = "nasmila";
$password = password_hash("1234", PASSWORD_DEFAULT);

// Prepare SQL
$stmt = $conn->prepare("INSERT INTO admins (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $password);

if ($stmt->execute()) {
    echo "Admin user 'nasmila' added successfully!";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
