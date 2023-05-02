/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:lit/recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier', 'lit'],
    rules: {
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'variableLike',
                format: ['snake_case', 'UPPER_CASE'],
            },
            {
                selector: 'typeLike',
                format: ['snake_case', 'UPPER_CASE'],
            },
            {
                selector: 'interface',
                // We prefer snake_case for interfaces, but PascalCase is also acceptable (primarily for things imported from other libraries or lib.dom.d.ts).
                format: ['PascalCase', 'snake_case'],
            },
        ],
    },

    root: true,
};
