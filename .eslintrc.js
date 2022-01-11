"use strict";

module.exports = {
  settings: {
    "import/internal-regex": "^ember-alexandria/",
  },
  extends: ["@adfinis-sygroup/eslint-config/ember-addon"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    // TODO: clean up redundant config when the following PR is merged
    // https://github.com/adfinis-sygroup/eslint-config/pull/235
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
