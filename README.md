# UAAuthSec - User-Aware Adaptive Authentication & Security System

## 🛡️ Project Overview
UAAuthSec is a premium, enterprise-grade authentication system designed with a "Security-First" philosophy. It implements **Adaptive Risk-Based Authentication**, which intelligently adjusts security challenges based on user context, device fingerprinting, and behavioral analysis.

### 🌟 Key Features
- **Adaptive Authentication**: Dynamic risk scoring (Low, Medium, High) determines whether to allow login, challenge with MFA, or block access.
- **Context-Aware Engine**: Analyzes IP geolocation, device fingerprints (FingerprintJS), and historical behavioral patterns.
- **Advanced MFA**: Multi-factor authentication via secure 6-digit OTP codes with automatic device trust escalation.
- **Security Hardening**:
  - Refresh Token Rotation (prevents session hijacking).
  - Brute-Force Protection (velocity checking & rate limiting).
  - Secure HttpOnly/SameSite/Secure Cookies.
  - Global Session Invalidation ("Logout from all devices").
- **Intelligence Dashboard**: Real-time security analytics and global threat monitoring for administrators.
- **Premium UI**: Modern dark-themed dashboard with glassmorphism and smooth animations.

## 🚀 Tech Stack
- **Backend**: Node.js, Express, Sequelize ORM, MySQL.
- **Frontend**: React, TypeScript, Vite, Framer Motion, Lucide Icons.
- **Security**: JWT, BCrypt, Helmet, Express-Rate-Limit, FingerprintJS.
- **Testing**: Jest, Supertest.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL Server

### 1. Database Setup
Create a MySQL database named `ua_auth_sec`. Update `backend/.env` with your credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ua_auth_sec
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 2. Backend Installation
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```

### 4. Running Tests
```bash
cd backend
npm test
```

## 🧠 Core Services
- `RiskEngine`: Calculates risk scores (0-100) based on Device, Location, and Time.
- `ContextService`: Captures and analyzes the technical context of every login attempt.
- `BehaviorService`: Detects brute-force patterns and unusual user activity.
- `AuditService`: Logs security alerts for administrative review.

## 📜 Documentation
- `architecture.md`: Detailed technical design and system components.
- `implementation_plan.md`: Step-by-step roadmap of the development phases.

---
Developed with ❤️ for Advanced Agentic Coding.
