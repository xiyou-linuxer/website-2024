import antfu from '@antfu/eslint-config'

export default antfu({
    stylistic: {
        indent: 4,
    },
    rules: {
        'jsonc/indent': ['error', 2],
        'yaml/indent': ['error', 2],
    },
}, {
    files: ['**/*.json'],
    rules: {
        'style/eol-last': ['warn', 'never'],
    },
})
