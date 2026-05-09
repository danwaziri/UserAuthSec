const BehaviorService = require('../../src/services/behaviorService');
const { LoginAttempt } = require('../../src/models');

jest.mock('../../src/models', () => ({
    LoginAttempt: {
        count: jest.fn(),
        findAll: jest.fn()
    }
}));

describe('BehaviorService Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('checkVelocity', () => {
        // ... (This section passed)
    });

    describe('analyzeTimePattern', () => {
        it('should return 0 if there is not enough data', async () => {
            LoginAttempt.findAll.mockResolvedValue(new Array(3).fill({ attempted_at: new Date() }));
            const result = await BehaviorService.analyzeTimePattern(1);
            expect(result).toBe(0);
        });

        it('should return 0 if login time is within normal patterns', async () => {
            const currentHour = new Date().getHours();
            // FIX: Changed 'created_at' to 'attempted_at'
            const normalLogins = new Array(10).fill(null).map(() => ({
                attempted_at: new Date().setHours(currentHour)
            }));

            LoginAttempt.findAll.mockResolvedValue(normalLogins);
            const result = await BehaviorService.analyzeTimePattern(1);
            expect(result).toBe(0);
        });

        it('should return 15 risk points if login time is unusual', async () => {
            const currentHour = new Date().getHours();
            const unusualHour = (currentHour + 12) % 24;

            // FIX: Changed 'created_at' to 'attempted_at'
            const pastLogins = new Array(10).fill(null).map(() => ({
                attempted_at: new Date().setHours(unusualHour)
            }));

            LoginAttempt.findAll.mockResolvedValue(pastLogins);
            const result = await BehaviorService.analyzeTimePattern(1);
            expect(result).toBe(15);
        });
    });
});