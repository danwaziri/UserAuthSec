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
        it('should return false if failure count is below threshold', async () => {
            LoginAttempt.count.mockResolvedValue(3);
            const result = await BehaviorService.checkVelocity('127.0.0.1');
            expect(result).toBe(false);
        });

        it('should return true if failure count reaches threshold', async () => {
            LoginAttempt.count.mockResolvedValue(5);
            const result = await BehaviorService.checkVelocity('127.0.0.1');
            expect(result).toBe(true);
        });
    });

    describe('analyzeTimePattern', () => {
        it('should return 0 if there is not enough data', async () => {
            LoginAttempt.findAll.mockResolvedValue(new Array(3).fill({ created_at: new Date() }));
            const result = await BehaviorService.analyzeTimePattern(1);
            expect(result).toBe(0);
        });

        it('should return 0 if login time is within normal patterns', async () => {
            const currentHour = new Date().getHours();
            const normalLogins = new Array(10).fill(null).map(() => ({
                created_at: new Date().setHours(currentHour)
            }));

            LoginAttempt.findAll.mockResolvedValue(normalLogins);
            const result = await BehaviorService.analyzeTimePattern(1);
            expect(result).toBe(0);
        });

        it('should return 15 risk points if login time is unusual', async () => {
            const currentHour = new Date().getHours();
            const unusualHour = (currentHour + 12) % 24;

            // All previous logins at an unusual hour
            const pastLogins = new Array(10).fill(null).map(() => ({
                created_at: new Date().setHours(unusualHour)
            }));

            LoginAttempt.findAll.mockResolvedValue(pastLogins);
            const result = await BehaviorService.analyzeTimePattern(1);
            expect(result).toBe(15);
        });
    });
});
