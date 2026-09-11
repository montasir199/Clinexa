# 🏥 MedSync – Hospital Management System
**Enterprise Multi-Tenant Hospital & Clinic Management SaaS**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> نظام إدارة المستشفيات والعيادات الطبية السحابي المتكامل
> 
> Integrated Cloud-Based Hospital & Clinic Management System

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Security & Compliance](#security--compliance)
- [Development](#development)
- [Contributing](#contributing)

---

## ✨ Features

### Clinical Features
- 📋 **Electronic Health Records (EHR)** - Comprehensive patient medical histories
- 👨‍⚕️ **Appointment Management** - Scheduling, confirmations, and reminders
- 💊 **Pharmacy Management** - Medication inventory, prescriptions, and dispensing
- 🔬 **Laboratory System** - Test orders, results tracking, and reporting
- 🖼️ **Radiology Management** - Medical imaging orders and archival
- 💰 **Billing & Invoicing** - Integrated payment processing (ZATCA compliant)
- 📊 **Consultation Room** - Real-time patient consultations with doctor notes

### Administrative Features
- 🏥 **Multi-Tenant Architecture** - Support for multiple hospitals/clinics
- 👥 **Role-Based Access Control (RBAC)** - Super Admin, Hospital Admin, Doctor, Receptionist roles
- 📈 **Analytics & Reporting** - Revenue, patient statistics, operational metrics
- 🔐 **Audit Logging** - Complete activity tracking for compliance
- 🌍 **Bilingual Interface** - Full Arabic (RTL) and English support
- 🌓 **Dark Mode** - Comfortable UI for extended use

### Technical Features
- 🚀 **Fast Development** - Vite with HMR
- 🎨 **Modern UI** - Tailwind CSS + Motion animations
- 🤖 **AI Integration** - Google Gemini API for clinical insights
- 📱 **Fully Responsive** - Mobile, tablet, desktop
- ♿ **Accessibility** - WCAG 2.1 compliance

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS 4.1
- **Animations**: Motion 12.23
- **UI Components**: Lucide React (icons)
- **Charts**: Recharts 3.8
- **Form Utilities**: React Dropzone, clsx

### Backend
- **Runtime**: Node.js + Express.js 4.21
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: better-sqlite3 (client-side demo)
- **AI**: Google Genai SDK 1.29
- **Environment**: dotenv for config

### Development
- **Language**: TypeScript ~5.8
- **Build Runner**: tsx 4.21
- **CSS Processing**: Autoprefixer, Tailwind CSS

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/montasir199/Clinexa.git
cd Clinexa

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Configuration

Edit `.env.local` with your settings:

```env
# Google Gemini API
GEMINI_API_KEY=your_api_key_here

# Server Configuration
SERVER_PORT=3001
NODE_ENV=development

# Database (production)
DATABASE_URL=postgresql://user:password@localhost:5432/medsync
DB_SSL=false

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Features
ENABLE_2FA=true
ENABLE_AUDIT_LOGS=true
```

### Development

```bash
# Start development server (Frontend: http://localhost:3000)
npm run dev

# In a separate terminal, start backend (API: http://localhost:3001)
npm run server

# Type checking
npm run lint

# Run tests
npm run test
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
Clinexa/
├── src/
│   ├── components/
│   │   ├── common/              # Shared components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopNavbar.tsx
│   │   │   ├── CommandPalette.tsx
│   │   │   ├── ToastContainer.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── patients/            # Patient management module
│   │   ├── doctors/             # Doctor management module
│   │   ├── appointments/        # Appointment scheduling
│   │   ├── consultation/        # Real-time consultation
│   │   ├── pharmacy/            # Pharmacy operations
│   │   ├── laboratory/          # Lab management
│   │   ├── radiology/           # Imaging management
│   │   ├── billing/             # Billing & payments
│   │   ├── reports/             # Analytics & reports
│   │   ├── audit/               # Audit logging
│   │   ├── hospital/            # Hospital dashboard
│   │   └── superadmin/          # Super admin panel
│   ├── context/
│   │   ├── MedSyncContext.tsx   # Global auth & state
│   │   └── ThemeContext.tsx     # Dark mode context
│   ├── hooks/
│   │   ├── useAuth.ts           # Authentication hook
│   │   ├── useMedSync.ts        # Global state hook
│   │   └── useApi.ts            # API request hook
│   ├── types/
│   │   ├── medsync.ts           # Domain types
│   │   └── auth.ts              # Auth types
│   ├── utils/
│   │   ├── documentTemplates.ts # Document generation
│   │   ├── printDocument.ts     # Print utilities
│   │   ├── api.ts               # API client
│   │   └── validators.ts        # Form validation
│   ├── styles/
│   │   └── index.css            # Global styles
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
├── server/
│   ├── routes/
│   │   ├── auth.ts              # Authentication endpoints
│   │   ├── patients.ts          # Patient CRUD
│   │   ├── doctors.ts           # Doctor management
│   │   ├── appointments.ts      # Appointment management
│   │   ├── pharmacy.ts          # Pharmacy operations
│   │   ├── laboratory.ts        # Lab management
│   │   ├── billing.ts           # Billing operations
│   │   └── admin.ts             # Admin endpoints
│   ├── middleware/
│   │   ├── auth.ts              # JWT verification
│   │   ├── rbac.ts              # Role-based access
│   │   ├── errorHandler.ts      # Error handling
│   │   └── logger.ts            # Request logging
│   ├── models/
│   │   ├── Patient.ts
│   │   ├── Doctor.ts
│   │   ├── Appointment.ts
│   │   └── ...
│   ├── database/
│   │   ├── migrations/          # Schema migrations
│   │   ├── seeds/               # Initial data
│   │   └── db.ts                # Connection pool
│   ├── services/
│   │   ├── AuthService.ts       # Authentication logic
│   │   ├── EmailService.ts      # Email notifications
│   │   ├── GeminiService.ts     # AI integration
│   │   └── ...
│   ├── utils/
│   │   ├── jwt.ts               # JWT utilities
│   │   ├── bcrypt.ts            # Password hashing
│   │   └── logger.ts            # Logging utility
│   └── index.ts                 # Server entry point
├── tests/
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── fixtures/                # Test data
├── .env.example                 # Environment template
├── .env.local                   # (local only) Environment config
├── .gitignore                   # Git ignore rules
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🔌 API Documentation

### Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://api.medsync.example.com/api`

### Authentication Endpoints

#### POST `/auth/register`
Register a new hospital/clinic account.

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "hospitalName": "Central Hospital",
    "adminEmail": "admin@hospital.com",
    "password": "SecurePass123!",
    "city": "Riyadh",
    "phone": "+966501234567"
  }'
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Hospital registered successfully",
  "data": {
    "hospitalId": "hosp_123456",
    "adminUser": {
      "id": "user_123456",
      "email": "admin@hospital.com",
      "role": "hospital_admin"
    },
    "token": "eyJhbGc..."
  }
}
```

#### POST `/auth/login`
Authenticate and receive JWT token.

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@hospital.com",
    "password": "SecurePass123!"
  }'
```

**Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "user_123456",
    "email": "doctor@hospital.com",
    "role": "doctor",
    "hospitalId": "hosp_123456",
    "fullName": "Dr. Ahmed Al-Mansouri"
  }
}
```

#### POST `/auth/2fa/verify`
Verify two-factor authentication code.

```bash
curl -X POST http://localhost:3001/api/auth/2fa/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{ "code": "123456" }'
```

#### POST `/auth/refresh`
Refresh JWT token.

```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Authorization: Bearer {refresh_token}"
```

### Patients Endpoints

#### GET `/patients`
List patients (paginated).

```bash
curl -X GET "http://localhost:3001/api/patients?page=1&limit=20" \
  -H "Authorization: Bearer {token}"
```

#### POST `/patients`
Create new patient.

```bash
curl -X POST http://localhost:3001/api/patients \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "email": "patient@example.com",
    "phone": "+966501234567",
    "dateOfBirth": "1990-01-15",
    "nationalId": "1234567890",
    "gender": "M",
    "bloodType": "O+",
    "chronicDiseases": ["Diabetes", "Hypertension"]
  }'
```

#### GET `/patients/{id}`
Get patient details and full medical history.

#### PUT `/patients/{id}`
Update patient information.

#### DELETE `/patients/{id}`
Archive/delete patient record.

### Appointments Endpoints

#### POST `/appointments`
Book an appointment.

```bash
curl -X POST http://localhost:3001/api/appointments \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "pat_123456",
    "doctorId": "doc_123456",
    "appointmentType": "consultation",
    "scheduledAt": "2024-12-20T14:30:00Z",
    "reason": "Routine checkup"
  }'
```

#### GET `/appointments/doctor/{doctorId}`
Get appointments for a specific doctor.

#### PUT `/appointments/{id}`
Update appointment status (confirmed, cancelled, completed).

### Full API Documentation
Complete Swagger/OpenAPI documentation available at:
- **Dev**: http://localhost:3001/api/docs
- **Production**: https://api.medsync.example.com/api/docs

---

## 🔐 Security & Compliance

### HIPAA Compliance
- ✅ End-to-end encryption (AES-256 GCM)
- ✅ Two-factor authentication (2FA)
- ✅ Comprehensive audit logging
- ✅ Role-based access control
- ✅ Secure password hashing (bcrypt)
- ✅ HTTPS only (production)

### ZATCA Compliance (KSA)
- ✅ VAT number validation
- ✅ Invoice digitization
- ✅ E-invoice submission ready
- ✅ Compliance reporting

### Database Security
- Multi-tenant isolation (PostgreSQL RLS)
- SQL injection prevention (parameterized queries)
- Rate limiting on API endpoints
- Input validation and sanitization

### Additional Security Measures
- JWT token expiration (7 days default)
- CORS protection
- Helmet.js for HTTP headers
- Request size limits
- XSS protection

### Authentication Flow
```
User Login
    ↓
POST /auth/login
    ↓
Validate Credentials (bcrypt)
    ↓
If 2FA Enabled → Send OTP
    ↓
User Enters OTP
    ↓
POST /auth/2fa/verify
    ↓
Generate JWT Token
    ↓
Return Token + Refresh Token
    ↓
Store in Secure HTTP-Only Cookies
```

---

## 💻 Development

### Prerequisites for Development
```bash
# Install global dependencies
npm install -g tsx  # TypeScript executor
npm install -g nodemon  # Auto-restart on changes
```

### Running in Development

**Terminal 1 - Frontend** (Port 3000):
```bash
npm run dev
```

**Terminal 2 - Backend** (Port 3001):
```bash
npm run server
```

**Terminal 3 - Watch for Changes**:
```bash
npm run watch
```

### Code Style & Linting

```bash
# Type checking
npm run lint

# Format code (if configured)
npm run format

# Fix linting issues
npm run lint:fix
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test src/utils/validators.test.ts
```

### Database Migrations

```bash
# Create new migration
npm run migrate:create --name add_audit_logs_table

# Run migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down
```

---

## 📚 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md) - System design & patterns
- [API Reference](./docs/API.md) - Detailed endpoint documentation
- [Database Schema](./docs/DATABASE.md) - ER diagrams and table structure
- [Security Guidelines](./docs/SECURITY.md) - Best practices & threat model
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

### Code Quality
- Write tests for new features
- Follow TypeScript strict mode
- Use meaningful commit messages
- Keep components focused and small

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

For issues, questions, or suggestions:
- 📧 Email: support@medsync.example.com
- 🐛 Issues: [GitHub Issues](https://github.com/montasir199/Clinexa/issues)
- 📖 Documentation: [Wiki](https://github.com/montasir199/Clinexa/wiki)

---

## 🚀 Roadmap

### Q1 2024
- [ ] Complete core modules implementation
- [ ] Advanced appointment scheduling
- [ ] Pharmacy inventory management
- [ ] Mobile app (React Native)

### Q2 2024
- [ ] Video consultation integration
- [ ] AI-powered diagnostics
- [ ] Insurance integration
- [ ] Advanced analytics dashboard

### Q3 2024
- [ ] Multi-language support (additional languages)
- [ ] Offline mode
- [ ] Advanced reporting
- [ ] Integration marketplace

---

**Made with ❤️ by the MedSync Team**

*Last Updated: September 2024*
