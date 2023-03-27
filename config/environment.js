"use strict";

module.exports = function (environment) {
  const ENV = {
    modulePrefix: "ember-alexandria",
    environment,

    "ember-alexandria": {},

    APP: {},
  };

  if (environment === "test") {
    ENV.locationType = 'none';
    ENV.APP.rootElement = "#ember-testing";
    ENV.APP.autoboot = false;
  }

  return ENV;
};
