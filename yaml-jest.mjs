import transformer from 'yaml-jest';

/**
 * Workaround wrapper for jest 28 breaking changes breaking yaml transform.
 * @see https://github.com/sumwatshade/jest-transform-yaml/issues/19#issuecomment-1232857013
 */
export default {
    ...transformer,
    process: (...args) => {
        return {
            code: transformer?.process(...args),
            map: null,
        };
    },
};
