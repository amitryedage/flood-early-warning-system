import { describe, it, expect } from 'vitest';
const { calculateNewWaterLevel, determineRiskStatus } = require('./simulationService');

describe('Flood Simulation Logic', () => {

    describe('determineRiskStatus', () => {
        it('should return NORMAL for levels <= 13.0', () => {
            expect(determineRiskStatus(12.0)).toBe('NORMAL');
            expect(determineRiskStatus(13.0)).toBe('NORMAL');
        });

        it('should return WARNING for levels between 13.0 and 14.5', () => {
            expect(determineRiskStatus(13.1)).toBe('WARNING');
            expect(determineRiskStatus(14.5)).toBe('WARNING');
        });

        it('should return CRITICAL for levels > 14.5', () => {
            expect(determineRiskStatus(14.6)).toBe('CRITICAL');
            expect(determineRiskStatus(20.0)).toBe('CRITICAL');
        });
    });

    describe('calculateNewWaterLevel', () => {
        it('should increase level significantly during heavy rainfall (>80)', () => {
            const initial = 12.0;
            const updated = calculateNewWaterLevel(initial, 100);
            expect(updated).toBe(initial + 0.05);
        });

        it('should decrease level during low rainfall (<20)', () => {
            const initial = 12.0;
            const updated = calculateNewWaterLevel(initial, 10);
            expect(updated).toBe(initial - 0.02);
        });

        it('should increase slightly during moderate rainfall', () => {
            const initial = 12.0;
            const updated = calculateNewWaterLevel(initial, 50);
            expect(updated).toBe(initial + 0.01);
        });

        it('should never go below 10.0 meters', () => {
            const initial = 10.01;
            const updated = calculateNewWaterLevel(initial, 5); // Low rainfall would decrease by 0.02
            expect(updated).toBe(10.0);
        });
    });
});
