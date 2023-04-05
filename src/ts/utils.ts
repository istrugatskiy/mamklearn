/**
 * Sleeps for a given amount of time the current "thread".
 *
 * @param ms The amount of time to sleep in milliseconds.
 * @returns A promise that resolves after the given amount of time (approximately).
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
