module.exports = {
  "extends": [
    "airbnb",
    "eslint:recommended",
    "plugin:vue/recommended" // or 'plugin:vue/base'
  ],
  "env": {
      "browser": true,
      "node": true,
      "es6": true,
      "jquery": true
  },
  "globals": {
    "_": false
  },
  "rules": {
    'no-console': 2,
    'import/extensions': ['error', 'never', {
      jsx: 'always',
    }],
    "vue/valid-v-if": "error"
  }
};
