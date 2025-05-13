# Portfolio Website with Node.js Backend and Admin Dashboard

A responsive portfolio website with interactive animations, Node.js/MySQL backend, JWT authentication, and a secure admin dashboard.

## Features

- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Interactive Animations**: Includes scroll-triggered animations, hover effects, and glowing elements
- **Node.js Backend**: Complete RESTful API implementation with Express
- **JWT Authentication**: Secure admin dashboard access
- **Admin Dashboard**: Manage projects and view contact submissions
- **Five Main Sections**: Home, About, Projects, Contact, and Footer
- **Accessibility**: Keyboard navigation support and proper image alt text
- **Security**: Form validation, JWT authentication, and SQL injection prevention

## Project Structure

```
├── admin/                  # Admin dashboard files
│   ├── css/                # Admin dashboard styles
│   │   └── admin.css       # Admin dashboard CSS
│   ├── js/                 # Admin dashboard scripts
│   │   └── admin.js        # Admin dashboard JavaScript
│   └── index.html          # Admin dashboard HTML
├── css/                    # Frontend styles
│   └── style.css           # CSS styles and animations
├── images/                 # Project and site images
├── js/
│   ├── main.js             # Original JavaScript file
│   └── main-updated.js     # Updated JavaScript for Node.js backend
├── php/                    # Original PHP files (kept for reference)
│   ├── contact.php         # Original contact form handler
│   ├── load_projects.php   # Original project loader
│   └── db_setup.sql        # Database setup script
├── .env                    # Environment variables
├── package.json            # Node.js dependencies
├── server.js               # Main Node.js server file
├── index.html              # Frontend HTML
└── README.md               # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL database

### Database Setup

1. Create a MySQL database named `portfolio`
2. Import the database schema from `php/db_setup.sql`

```sql
CREATE DATABASE portfolio;
USE portfolio;

-- Run the SQL commands from php/db_setup.sql
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio
PORT=3000
JWT_SECRET=your_secure_jwt_secret_key
```

3. Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## Usage

### Frontend

Access the portfolio website at: `http://localhost:3000`

### Admin Dashboard

Access the admin dashboard at: `http://localhost:3000/admin`

Default admin credentials:
- Username: `admin`
- Password: `admin123`

## API Endpoints

### Authentication

- `POST /api/admin/login` - Admin login

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project (requires authentication)
- `PUT /api/projects/:id` - Update a project (requires authentication)
- `DELETE /api/projects/:id` - Delete a project (requires authentication)

### Contact Messages

- `POST /api/contact` - Submit a contact form
- `GET /api/contact` - Get all contact messages (requires authentication)

## Frontend Integration

To use the Node.js backend instead of the PHP backend:

1. Rename `js/main-updated.js` to `js/main.js` (or update the script reference in `index.html`)
2. Update the API base URL in `js/main-updated.js` if your server runs on a different port

## Security Considerations

- The JWT secret should be changed in production
- Admin password should be changed after first login
- Consider implementing rate limiting for login attempts
- Use HTTPS in production
   ```

2. Place the entire project folder in your web server's document root (e.g., `htdocs` for XAMPP)

### Running the Website

1. Start your web server (Apache and MySQL)
2. Navigate to `http://localhost/kko` in your web browser (adjust the path if needed)

## Customization

### Adding Projects

You can add projects in two ways:

1. **Database Method**: Add entries to the `projects` table in the database
2. **HTML Method**: Add project cards directly in the `index.html` file

### Changing Colors

The color scheme can be modified by editing the CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #2a2a72;
    --secondary-color: #009ffd;
    --accent-color: #00d4ff;
    --dark-color: #1a1a2e;
    --light-color: #f8f9fa;
    --transition: all 0.3s ease;
}
```

## Browser Compatibility

Tested and working in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Credits

- Particles.js for background effects
- Font Awesome for icons

## License

This project is available for personal and commercial use.