# Installation Guide - UAAuthSec

This guide will walk you through setting up the **User-Aware Adaptive Authentication & Security System** on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher)
- **MySQL Server** (v8.0 or higher)

## 🗄️ 1. Database Configuration

1. Log in to your MySQL terminal:
   ```bash
   mysql -u root -p
   ```

2. Create the project database:
   ```sql
   CREATE DATABASE ua_auth_sec;
   ```

3. (Optional) Create a dedicated user for the app:
   ```sql
   CREATE USER 'ua_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON ua_auth_sec.* TO 'ua_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

## ⚙️ 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5001
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=ua_auth_sec
   DB_DIALECT=mysql
   
   # Security
   JWT_SECRET=super_secret_high_entropy_key_change_me
   JWT_EXPIRES_IN=15m
   
   # Frontend URL (CORS)
   CORS_ORIGIN=http://localhost:5173
   
   # Email Service (For MFA)
   # Leave empty to use Console Simulation Mode
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_specific_password
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

## 💻 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🧪 4. Running Verification Tests

To ensure everything is configured correctly, run the backend test suite:
```bash
cd backend
npm test
```

## 🛠️ Troubleshooting

- **Database Connection Error**: Verify that your MySQL server is running and the credentials in `backend/.env` match your setup.
- **Port Conflict**: If port 5000 or 5173 is occupied, you can change the `PORT` in `.env` or the Vite config respectively.
- **MFA Code Not Received**: If you haven't configured SMTP credentials, check the **Backend Terminal Output**. The OTP code will be logged there in simulation mode.

---
**System is now ready for use!** Access the app at [http://localhost:5173](http://localhost:5173).
