module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: ['airbnb'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "max-len": [ "error", { code: 255, comments: 255 }],
    "linebreak-style": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "jsx-a11y/label-has-for": [ 2, {
      "required": {
          "every": [ "id" ]
      }
    }],
    "react/prop-types": 0
  },
};
