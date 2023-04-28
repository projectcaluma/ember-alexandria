"use strict";

module.exports = function (environment) {
  const ENV = {
    modulePrefix: "ember-alexandria",
    environment,

    "ember-alexandria": {},

    APP: {},
  };

  if (environment === "test") {
    // Testem prefers this...
    ENV.locationType = "none";

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = "#ember-testing";
    ENV.APP.autoboot = false;
  }

  return ENV;
};
