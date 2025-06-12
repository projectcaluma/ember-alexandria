import adfinisEmberAddonConfig from "@adfinis/eslint-config/ember-addon";
import ember from "eslint-plugin-ember";

export default [
  ...adfinisEmberAddonConfig,
  {
    plugins: { ember },
    settings: {
      "import/internal-regex": "^ember-alexandria/",
    },
    rules: {
      "ember/no-runloop": "warn",
    },
  },
];
