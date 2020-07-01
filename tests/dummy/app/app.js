import Application from "@ember/application";
import Resolver from "ember-resolver";
import loadInitializers from "ember-load-initializers";
import config from "./config/environment";

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  constructor(...args) {
    super(...args);

    this.engines = {
      emberAlexandria: {
        dependencies: {
          services: ["store", "intl", "notification"],
        },
      },
    };
  }
}

loadInitializers(App, config.modulePrefix);
