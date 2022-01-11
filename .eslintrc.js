"use strict";

module.exports = {
  settings: {
    "import/internal-regex": "^ember-alexandria/",
  },
  extends: ["@adfinis-sygroup/eslint-config/ember-addon"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
      ],
    },
  },

  globals: {
    Ember: "readonly",
  },
};
