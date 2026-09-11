# 🤝 Contributing to MedSync

Thank you for your interest in contributing to MedSync! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- No harassment or discrimination
- Constructive feedback only
- Focus on ideas, not individuals

---

## Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- Git
- PostgreSQL (for production-like testing)

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/montasir199/Clinexa.git
cd Clinexa

# Install dependencies
npm install

# Create local environment file
cp .env.example .env.local

# Start development servers
npm run dev      # Terminal 1: Frontend
npm run server   # Terminal 2: Backend
```

---

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions
- `chore/` - Build/config changes

### 2. Make Your Changes

- Keep commits atomic and focused
- Write descriptive commit messages
- Follow code style guidelines
- Add tests for new features

### 3. Write Tests

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Check coverage
npm run test:coverage
```

**Testing Guidelines:**
- Write unit tests for utilities and services
- Write integration tests for API endpoints
- Test error cases and edge cases
- Aim for >80% code coverage

### 4. Format & Lint

```bash
# Type checking
npm run lint

# Format code (if available)
npm run format

# Fix linting issues
npm run lint:fix
```

### 5. Commit Your Changes

```bash
# Good commit message examples:
git commit -m "feat: Add patient search functionality"
git commit -m "fix: Correct appointment time zone handling"
git commit -m "docs: Update API documentation"
git commit -m "test: Add tests for login flow"
```

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Changes that don't affect code meaning (formatting, etc)
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `perf` - Code change that improves performance
- `test` - Adding missing tests
- `chore` - Changes to build process, dependencies, etc

### 6. Push to GitHub

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to https://github.com/montasir199/Clinexa
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template with:
   - Description of changes
   - Related issues (use `Fixes #123`)
   - Screenshots (if UI changes)
   - Testing instructions
5. Request reviewers
6. Submit PR

---

## Code Style Guidelines

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  role: UserRole;
}

class AuthService {
  async login(email: string, password: string): Promise<Token> {
    // Implementation
  }
}

// ❌ Bad
interface User {
  id,
  email,
  role
}

function login(email, password) {
  // No return type
}
```

### React Components

```typescript
// ✅ Good - Functional component with proper typing
interface PatientListProps {
  hospitalsId: string;
  onSelect: (patient: Patient) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  hospitalId,
  onSelect,
}) => {
  return (
    <div>
      {/* Implementation */}
    </div>
  );
};

// ❌ Bad - No prop types, poor structure
export default function PatientList(props) {
  return <div>{/* Implementation */}</div>;
}
```

### File Organization

```
src/
├── components/
│   ├── patients/
│   │   ├── PatientList.tsx        # Component
│   │   ├── PatientDetail.tsx      # Component
│   │   ├── PatientForm.tsx        # Component
│   │   ├── index.ts               # Barrel export
│   │   └── types.ts               # Component-specific types
│   └── common/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── index.ts
├── hooks/
│   ├── usePatients.ts
│   └── useAuth.ts
├── types/
│   └── medsync.ts                 # Global types
├── utils/
│   ├── api.ts                     # API client
│   ├── validators.ts              # Validation helpers
│   └── encryption.ts              # Encryption utilities
└── App.tsx
```

### Naming Conventions

- **Components**: PascalCase (`PatientList.tsx`)
- **Hooks**: camelCase with `use` prefix (`usePatients.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types/Interfaces**: PascalCase (`Patient`, `UserRole`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)

---

## API Development Guidelines

### Adding New Endpoints

```typescript
// server/routes/patients.ts
import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/rbac';
import { PatientService } from '../services/PatientService';

const router = express.Router();

/**
 * POST /api/patients
 * Create a new patient record
 * @param {string} firstName - Patient's first name
 * @param {string} email - Patient's email address
 * @returns {Patient} Created patient object
 */
router.post(
  '/',
  authenticateToken,
  checkRole(['doctor', 'hospital_admin']),
  async (req, res, next) => {
    try {
      const patient = await PatientService.create(req.body);
      res.status(201).json({ success: true, data: patient });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
```

### Error Handling

```typescript
// server/middleware/errorHandler.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// In routes:
router.get('/:id', async (req, res, next) => {
  try {
    const patient = await PatientService.findById(req.params.id);
    if (!patient) {
      throw new ApiError(404, 'Patient not found');
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
});
```

---

## Testing Guidelines

### Unit Tests

```typescript
// src/utils/__tests__/validators.test.ts
import { validateEmail, validatePhone } from '../validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });
});
```

### Integration Tests

```typescript
// tests/integration/auth.test.ts
import request from 'supertest';
import app from '../../server';

describe('Auth Endpoints', () => {
  it('POST /api/auth/login should return token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
```

---

## Documentation Guidelines

### Code Comments

```typescript
// ✅ Good - Explains WHY, not WHAT
// We check for existing appointments in a 30-minute window
// to prevent double-booking due to slow network conditions
const existingAppointment = await findAppointment(
  doctorId,
  appointmentTime,
  30
);

// ❌ Bad - Obviously what the code does
// Check if appointment exists
const existingAppointment = await findAppointment(...);
```

### JSDoc Comments

```typescript
/**
 * Encrypts sensitive patient data using AES-256-GCM
 *
 * @param {string} data - The plaintext data to encrypt
 * @param {string} key - Encryption key (256-bit)
 * @returns {Promise<string>} Base64-encoded encrypted data
 * @throws {Error} If encryption fails
 *
 * @example
 * const encrypted = await encryptData('SSN: 123-45-6789', key);
 */
async function encryptData(data: string, key: string): Promise<string> {
  // Implementation
}
```

---

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Tests pass: `npm run test`
- [ ] No linting errors: `npm run lint`
- [ ] Types check: `npm run lint` (TypeScript)
- [ ] Code formatted consistently
- [ ] Added/updated relevant tests
- [ ] Updated documentation
- [ ] Commit messages follow convention
- [ ] No hardcoded secrets or credentials
- [ ] No console.log statements (use logger)
- [ ] Follows project code style

---

## Review Process

1. **Automated Checks**
   - CI/CD runs tests and linting
   - Code coverage is maintained (>80%)
   - All checks must pass

2. **Code Review**
   - At least one maintainer review required
   - Constructive feedback provided
   - Address comments or discuss concerns

3. **Approval & Merge**
   - Approved by maintainers
   - Branch is up-to-date with main
   - Squash and merge to keep history clean

---

## Common Development Tasks

### Adding a New Feature Module

```bash
# 1. Create component structure
mkdir src/components/newfeature
touch src/components/newfeature/index.ts
touch src/components/newfeature/NewFeature.tsx
touch src/components/newfeature/types.ts

# 2. Create tests
mkdir tests/unit/newfeature
touch tests/unit/newfeature/NewFeature.test.tsx

# 3. Create API routes (if needed)
touch server/routes/newfeature.ts

# 4. Add types
# Update src/types/medsync.ts with new domain types
```

### Database Changes

```bash
# Create migration
npm run migrate:create --name descriptive_name

# Run migrations
npm run migrate:up

# Rollback if needed
npm run migrate:down
```

### Adding Dependencies

```bash
# Frontend
npm install package-name

# Backend
npm install package-name

# Development only
npm install --save-dev package-name

# Always update package-lock.json
```

---

## Getting Help

- 📖 Read the [API Documentation](./docs/API.md)
- 🏗️ Check [Architecture Guide](./docs/ARCHITECTURE.md)
- 💬 Ask in GitHub Discussions
- 📧 Email: support@medsync.example.com

---

## Recognition

Contributors will be recognized in:
- [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- GitHub contributor list
- Release notes

---

Thank you for contributing to MedSync! 🙏
