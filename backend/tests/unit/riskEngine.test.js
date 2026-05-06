const RiskEngine = require('../../src/services/riskEngine');
const BehaviorService = require('../../src/services/behaviorService');
const { LoginAttempt } = require('../../src/models');

jest.mock('../../src/models', () => ({
    LoginAttempt: {
        findOne: jest.fn()
    }
}));

jest.mock('../../src/services/behaviorService', () => ({
    analyzeTimePattern: jest.fn()
}));

describe('RiskEngine Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('assessDeviceRisk', () => {
        it('should return 40 points for unknown device', async () => {
            const result = await RiskEngine.assessDeviceRisk(1, null);
            expect(result.points).toBe(40);
        });

        it('should return 0 points for trusted device', async () => {
            const result = await RiskEngine.assessDeviceRisk(1, { is_trusted: true });
            expect(result.points).toBe(0);
        });

        it('should return 20 points for untrusted but recognized device', async () => {
            const result = await RiskEngine.assessDeviceRisk(1, { is_trusted: false });
            expect(result.points).toBe(20);
        });
    });

    describe('assessLocationRisk', () => {
        it('should return 10 points if location is missing', async () => {
            const result = await RiskEngine.assessLocationRisk(1, null);
            expect(result.points).toBe(10);
        });

        it('should return 30 points for a new country', async () => {
            LoginAttempt.findOne.mockResolvedValue({
                geolocation: { countryCode: 'US', city: 'NYC' }
            });

            const result = await RiskEngine.assessLocationRisk(1, { countryCode: 'FR', country: 'France', city: 'Paris' });
            expect(result.points).toBe(30);
            expect(result.description).toContain('France');
        });

        it('should return 15 points for a new city in the same country', async () => {
            LoginAttempt.findOne.mockResolvedValue({
                geolocation: { countryCode: 'US', city: 'NYC' }
            });

            const result = await RiskEngine.assessLocationRisk(1, { countryCode: 'US', city: 'LA' });
            expect(result.points).toBe(15);
            expect(result.description).toContain('LA');
        });

        it('should return 0 points for a recognized location', async () => {
            LoginAttempt.findOne.mockResolvedValue({
                geolocation: { countryCode: 'US', city: 'NYC' }
            });

            const result = await RiskEngine.assessLocationRisk(1, { countryCode: 'US', city: 'NYC' });
            expect(result.points).toBe(0);
        });
    });

    describe('assessRisk (Integration level in engine)', () => {
        it('should calculate a total risk score and level correctly', async () => {
            // Mock Device: Untrusted (20pts)
            // Mock Location: Same city (0pts)
            // Mock Behavior: Unusual time (30pts)
            // Total: 50pts -> MEDIUM

            BehaviorService.analyzeTimePattern.mockResolvedValue(30);
            LoginAttempt.findOne.mockResolvedValue({
                geolocation: { countryCode: 'US', city: 'NYC' }
            });

            const user = { id: 1 };
            const context = {
                device: { is_trusted: false },
                geolocation: { countryCode: 'US', city: 'NYC' }
            };

            const result = await RiskEngine.assessRisk(user, context);

            expect(result.score).toBe(50);
            expect(result.level).toBe('MEDIUM');
            expect(result.factors).toHaveLength(2);
            expect(result.factors).toContain('Recognized but untrusted device');
            expect(result.factors).toContain('Unusual login time pattern detected');
        });

        it('should cap risk score at 100 and set HIGH level', async () => {
            // Unknown device (40) + New country (30) + Unusual time (30) + something else?
            // Actually 40+30+30 = 100.

            BehaviorService.analyzeTimePattern.mockResolvedValue(30);
            LoginAttempt.findOne.mockResolvedValue({
                geolocation: { countryCode: 'US', city: 'NYC' }
            });

            const user = { id: 1 };
            const context = {
                device: null, // 40
                geolocation: { countryCode: 'GB', country: 'UK', city: 'London' } // 30
            };

            const result = await RiskEngine.assessRisk(user, context);

            expect(result.score).toBe(100);
            expect(result.level).toBe('HIGH');
        });
    });
});
