"use strict";

module.exports = function (environment) {
  const ENV = {
    modulePrefix: "ember-alexandria",
    environment,

    "ember-alexandria": {},

    APP: {},
  };

  if (environment === "test") {
    ENV.APP.rootElement = "#ember-testing";
  }

  return ENV;
};
