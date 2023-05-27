import { mamk_math, sleep } from '..';

describe('mamk_math', () => {
    const { clamp, lerp, range } = mamk_math;
    describe('clamp', () => {
        it('should clamp a number between a minimum and maximum', () => {
            expect(clamp(0, 1, 2)).toBe(1);
            expect(clamp(0, -1, 2)).toBe(0);
            expect(clamp(0, 3, 2)).toBe(2);
        });
    });
    describe('lerp', () => {
        it('should linearly interpolate between two numbers', () => {
            expect(lerp(0, 1, 0)).toBe(0);
            expect(lerp(0, 1, 0.5)).toBe(0.5);
            expect(lerp(0, 1, 1)).toBe(1);
            expect(lerp(0, 1000, 0.25)).toBe(250);
        });
    });
    describe('range', () => {
        it('should return an array of numbers from [start] to [end with [step_size]', () => {
            expect(range(0, 1)).toEqual([0, 1]);
            expect(range(0, 1, 0.5)).toEqual([0, 0.5, 1]);
            expect(range(0, 2, 2)).toEqual([0, 2]);
            expect(range(0, 1, 0.1)).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
            expect(range(0, 10, 3)).toEqual([0, 3, 6, 9]);
        });
    });
});

describe('sleep', () => {
    it('should wait for a specified number of milliseconds', async () => {
        const start = Date.now();
        await sleep(100);
        const end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(100);
    });
});
