-- Rental Management System Database Setup
-- Execute this SQL file in your MySQL database (via phpMyAdmin or MySQL CLI)

-- Create database
CREATE DATABASE IF NOT EXISTS rental_management;
USE rental_management;

-- Table: admins
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: users (tenants)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: bills
CREATE TABLE IF NOT EXISTS bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    month VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    rent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    water_bill DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    sewage_bill DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('unpaid', 'paid', 'partial') DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_month (user_id, month, year)
);

-- Insert sample admin (username: admin, password: admin123)
-- Password is hashed using PHP's password_hash()
INSERT INTO admins (username, password) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample users
INSERT INTO users (name, contact, email) VALUES
('John Doe', '1234567890', 'john@example.com'),
('Jane Smith', '0987654321', 'jane@example.com'),
('Robert Johnson', '5551234567', 'robert@example.com'),
('Emily Davis', '5559876543', 'emily@example.com');

-- Insert sample bills
INSERT INTO bills (user_id, month, year, rent, water_bill, sewage_bill, total, status) VALUES
(1, 'January', 2024, 1200.00, 50.00, 30.00, 1280.00, 'paid'),
(1, 'February', 2024, 1200.00, 55.00, 30.00, 1285.00, 'paid'),
(2, 'January', 2024, 1500.00, 60.00, 35.00, 1595.00, 'paid'),
(2, 'February', 2024, 1500.00, 58.00, 35.00, 1593.00, 'unpaid'),
(3, 'January', 2024, 1000.00, 45.00, 25.00, 1070.00, 'paid');
