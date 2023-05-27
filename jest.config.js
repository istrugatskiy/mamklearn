/**
 * The jest.config.js file is used to configure the Jest testing framework.
 */
export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '\\.yaml$': '<rootDir>/yaml-jest.mjs',
    },
    moduleNameMapper: {
        '\\.(css)$': '<rootDir>/__mocks__/style-mock.ts',
    },
};
