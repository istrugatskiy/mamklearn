/**
 * The jest.config.js file is used to configure the Jest testing framework.
 */
export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css)$': '<rootDir>/__mocks__/style-mock.ts',
    },
};
