/**
 * Sleeps for a given amount of time the current "thread".
 *
 * @param ms The amount of time to sleep in milliseconds.
 * @returns A promise that resolves after the given amount of time (approximately).
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mamk_math = {
    /**
     * Linearly interpolates between {@link x} and {@link y} by {@link a}
     *
     * @param {number} x The initial value.
     * @param {number} y The new value.
     * @param {number} a The interpolation value.
     */
    lerp: (x: number, y: number, a: number) => x * (1 - a) + y * a,

    /**
     * Clamps a number between two values.
     *
     * @param {number} num The number to clamp.
     * @param {number} min The minimum value that the number can be.
     * @param {number} max The maximum value the number can be.
     * @return {number} The number clamped between the two specified values.
     */
    clamp: (num: number, min: number, max: number): number => {
        return num <= min ? min : num >= max ? max : num;
    },

    /**
     * Creates an iterable range array.
     * @param {number} start_at The number to start at.
     * @param {number} end_at The number to end at.
     * @param {number} step The step size.
     * @returns {number[]} The array.
     */
    range: (start_at: number, end_at: number, step = 1): number[] => {
        const arr = [];
        for (let i = start_at; i <= end_at; i += step) {
            arr.push(i);
        }
        return arr;
    },
};
