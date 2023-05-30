/**
 * Sleeps for a given amount of time the current "thread".
 * @param ms - The amount of time to sleep in milliseconds.
 * @returns A promise that resolves after the given amount of time (approximately).
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mamk_math = {
    /**
     * Linearly interpolates between {@link x} and {@link y} by {@link a}
     * @param x - The initial value.
     * @param y - The new value.
     * @param a - The interpolation value.
     */
    lerp: (x: number, y: number, a: number) => x * (1 - a) + y * a,

    /**
     * Clamps a number between two values.
     * @param min - The minimum value that the number can be.
     * @param num - The number to clamp.
     * @param max - The maximum value the number can be.
     * @returns The number clamped between the two specified values.
     */
    clamp: (min: number, num: number, max: number): number => {
        return num <= min ? min : num >= max ? max : num;
    },

    /**
     * Creates an iterable range array.
     * @param start_at - The number to start at.
     * @param end_at - The number to end at.
     * @param step - The step size.
     * @returns The array.
     */
    range: (start_at: number, end_at: number, step = 1): number[] => {
        // TODO: This needs to be generated once needed (through an iterator, like in Python).
        const arr = [];
        for (let i = start_at; i <= end_at; i += step) {
            const true_i = parseFloat(i.toFixed(10));
            arr.push(true_i);
        }
        return arr;
    },
};
