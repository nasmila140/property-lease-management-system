# Rental Management System

A complete, modern web application for managing rental properties, monthly bills, and payment history.

## Features

- **Admin Authentication**: Secure login system with session management
- **Dashboard**: Modern interface with statistics and recent activity
- **Add Monthly Bills**: Create new bills for tenants with rent, water, and sewage charges
- **Update Bills**: Search and modify existing bill records
- **Payment History**: View and filter all payment records with sorting capabilities

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins)

## Installation Instructions

### Prerequisites

- XAMPP, WAMP, or LAMP stack installed
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Modern web browser

### Setup Steps

1. **Install XAMPP/WAMP**
   - Download and install from official website
   - Start Apache and MySQL services

2. **Create Database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `rental_management`
   - Import the `database.sql` file:
     - Click on the `rental_management` database
     - Go to "Import" tab
     - Choose `database.sql` file
     - Click "Go" to execute

3. **Copy Project Files**
   - Copy all project files to your web server directory:
     - XAMPP: `C:\xampp\htdocs\rental-management\`
     - WAMP: `C:\wamp64\www\rental-management\`

4. **Configure Database Connection**
   - Open `db_connect.php`
   - Update the following if needed:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_USER', 'root');
     define('DB_PASS', ''); // Your MySQL password
     define('DB_NAME', 'rental_management');
     ```

5. **Access the Application**
   - Open your web browser
   - Navigate to: `http://localhost/rental-management/`
   - Login with default credentials:
     - **Username**: admin
     - **Password**: admin123

## File Structure

```
rental-management/
│
├── index.html              # Login page
├── dashboard.html          # Main dashboard
├── add_bills.html         # Add new bills page
├── update_bills.html      # Update existing bills page
├── view_history.html      # Payment history page
│
├── login.php              # Login authentication handler
├── logout.php             # Logout handler
├── check_session.php      # Session verification
├── db_connect.php         # Database connection
├── get_dashboard_data.php # Dashboard data provider
├── get_users.php          # User list provider
├── add_bills.php          # Add bill handler
├── search_bill.php        # Search bill handler
├── update_bills.php       # Update bill handler
├── view_history.php       # Payment history handler
│
├── style.css              # Main stylesheet
├── script.js              # Common JavaScript functions
├── database.sql           # Database setup file
└── README.md              # This file
```

## Database Schema

### admins
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `username` (VARCHAR, UNIQUE)
- `password` (VARCHAR, hashed)
- `created_at` (TIMESTAMP)

### users
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR)
- `contact` (VARCHAR)
- `email` (VARCHAR)
- `created_at` (TIMESTAMP)

### bills
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `user_id` (INT, FOREIGN KEY)
- `month` (VARCHAR)
- `year` (INT)
- `rent` (DECIMAL)
- `water_bill` (DECIMAL)
- `sewage_bill` (DECIMAL)
- `total` (DECIMAL)
- `status` (ENUM: 'unpaid', 'paid', 'partial')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Default Login Credentials

- **Username**: admin
- **Password**: admin123

**Important**: Change the default password after first login for security.

## Features Breakdown

### 1. Login System
- Secure authentication with password hashing
- Animated error messages
- Session management
- Auto-redirect if not authenticated

### 2. Dashboard
- Total tenants count
- Total bills count
- Unpaid bills count
- Paid bills count
- Recent bills table
- Quick action cards
- Responsive design

### 3. Add Monthly Bills
- Select tenant from dropdown
- Choose month and year
- Enter rent, water, and sewage amounts
- Auto-calculate total
- Set payment status
- Form validation
- Success/error notifications

### 4. Update Bills
- Search by tenant and month
- Display existing bill details
- Edit all bill fields
- Update payment status
- Form validation
- Success/error notifications

### 5. Payment History
- View all payment records
- Filter by tenant, status, and year
- Search functionality
- Sortable table columns
- Summary statistics
- Export to CSV (can be added)
- Responsive design

## Design Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Hover effects on interactive elements
- Responsive sidebar navigation
- Card-based layout
- Toast notifications
- Loading animations
- Mobile-friendly design
- Print-friendly tables

## Security Features

- Password hashing using PHP's `password_hash()`
- Prepared SQL statements to prevent SQL injection
- Input sanitization
- Session-based authentication
- CSRF protection ready
- XSS prevention

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Troubleshooting

### Cannot connect to database
- Check if MySQL service is running
- Verify database credentials in `db_connect.php`
- Ensure database exists and is properly imported

### Login not working
- Clear browser cache and cookies
- Check if session is enabled in PHP
- Verify admin credentials in database

### Pages not loading
- Check if Apache/PHP is running
- Verify file paths are correct
- Check PHP error logs

### Styling issues
- Clear browser cache
- Ensure `style.css` is loading
- Check browser console for errors

## Future Enhancements

- Add new tenant registration
- Email notifications for due bills
- PDF invoice generation
- Payment receipt generation
- Multi-language support
- Advanced reporting
- Tenant portal
- Mobile app

## License

This project is created for educational purposes.

## Support

For issues or questions, please check:
1. Installation instructions above
2. Troubleshooting section
3. PHP error logs in XAMPP/WAMP

## Credits

- Font Awesome for icons
- Google Fonts for typography
- PHP and MySQL for backend
