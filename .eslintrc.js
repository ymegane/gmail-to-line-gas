module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
    },
    env: {
        'googleappsscript/googleappsscript': true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    plugins: ['@typescript-eslint/eslint-plugin', 'googleappsscript'],
    rules: {
        'import/first': 0,
    },
};
