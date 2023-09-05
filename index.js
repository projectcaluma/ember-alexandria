"use strict";

// eslint-disable-next-line n/no-unpublished-require
const { buildEngine } = require("ember-engines/lib/engine-addon");

module.exports = buildEngine({
  name: require("./package.json").name,

  lazyLoading: {
    enabled: false,
  },
  options: {
    "@embroider/macros": {
      setOwnConfig: {},
    },
  },

  included(...args) {
    this._super.included.apply(this, ...args);

    const app = this._findHost(this);

    // TODO why is options in options?
    this.options.options[
      "@embroider/macros"
    ].setOwnConfig.enableFrontendThumbnailGeneration =
      app.options["ember-alexandria"]?.enableFrontendThumbnailGeneration ??
      false;
  },
});
