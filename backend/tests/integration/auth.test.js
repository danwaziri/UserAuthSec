const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('../../src/routes/authRoutes');
const { User, Session } = require('../../src/models');
const RiskEngine = require('../../src/services/riskEngine');
const BehaviorService = require('../../src/services/behaviorService');

// Prevent rate limiting from blocking test execution
jest.mock('../../src/middleware/rateLimiter', () => ({
    apiLimiter: (req, res, next) => next(),
    authLimiter: (req, res, next) => next()
}));

// Mock Database Models
jest.mock('../../src/models', () => ({
    User: { findOne: jest.fn(), findByPk: jest.fn() },
    LoginAttempt: { create: jest.fn() },
    Device: { findByPk: jest.fn() },
    Session: { create: jest.fn(), findOne: jest.fn(), destroy: jest.fn() },
    MFAToken: { create: jest.fn(), destroy: jest.fn(), findOne: jest.fn() }
}));

// Mock Services - Fixed RiskEngine mock to return valid objects
jest.mock('../../src/services/riskEngine', () => ({
    assessRisk: jest.fn()
}));

jest.mock('../../src/services/behaviorService', () => ({
    checkVelocity: jest.fn()
}));

jest.mock('../../src/services/contextService', () => ({
    captureContext: jest.fn().mockResolvedValue({
        ip: '127.0.0.1',
        userAgent: 'test-agent',
        geolocation: { countryCode: 'US' },
        device: { id: 1 }
    }),
    logAttempt: jest.fn().mockResolvedValue({})
}));

jest.mock('../../src/services/geoIPService', () => ({
    lookup: jest.fn().mockResolvedValue({ country: 'USA', countryCode: 'US', city: 'NYC' })
}));

jest.mock('../../src/services/auditService', () => ({
    logSecurityAlert: jest.fn().mockResolvedValue({}),
    logSecurityEvent: jest.fn().mockResolvedValue({})
}));

jest.mock('../../src/services/mfaService', () => ({
    generateAndSendOTP: jest.fn().mockResolvedValue({}),
    verifyOTP: jest.fn().mockResolvedValue(true)
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRoutes);

// Error handler to help debug 500 errors during tests
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

describe('Auth Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/v1/auth/login', () => {
        const testUser = {
            id: 1,
            email: 'test@test.com',
            password: 'hashedpassword',
            is_active: true,
            role: 'user',
            comparePassword: jest.fn().mockResolvedValue(true)
        };

        it('should return 401 for invalid credentials', async () => {
            User.findOne.mockResolvedValue(null);
            BehaviorService.checkVelocity.mockResolvedValue(false);

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'wrong@test.com', password: 'password', fingerprint: 'test-fp' });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it('should return 200 and tokens for a low-risk login', async () => {
            User.findOne.mockResolvedValue(testUser);
            BehaviorService.checkVelocity.mockResolvedValue(false);
            
            // Fix: Mocking the specific return object for low risk
            RiskEngine.assessRisk.mockResolvedValue({
                score: 10,
                level: 'LOW',
                factors: []
            });

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'test@test.com', password: 'password123', fingerprint: 'test-fp' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
        });

        it('should return mfaRequired: true for a medium-risk login', async () => {
            User.findOne.mockResolvedValue(testUser);
            BehaviorService.checkVelocity.mockResolvedValue(false);

            // Fix: Mocking the specific return object for medium risk
            RiskEngine.assessRisk.mockResolvedValue({
                score: 50,
                level: 'MEDIUM',
                factors: ['Untrusted device']
            });

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'test@test.com', password: 'password123', fingerprint: 'test-fp' });

            expect(response.status).toBe(200);
            expect(response.body.mfaRequired).toBe(true);
            expect(response.body.riskLevel).toBe('MEDIUM');
        });

        it('should return 403 for a high-risk login', async () => {
            User.findOne.mockResolvedValue(testUser);
            BehaviorService.checkVelocity.mockResolvedValue(false);

            // Fix: Mocking the specific return object for high risk
            RiskEngine.assessRisk.mockResolvedValue({
                score: 90,
                level: 'HIGH',
                factors: ['Suspicious location', 'Unknown device']
            });

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'test@test.com', password: 'password123', fingerprint: 'test-fp' });

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.riskLevel).toBe('HIGH');
        });
    });
});