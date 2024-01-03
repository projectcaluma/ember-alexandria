import Engine from "@ember/engine";
import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

import config from "ember-alexandria/config/environment";

const { modulePrefix } = config;

export default class EmberAlexandriaEngine extends Engine {
  modulePrefix = modulePrefix;
  Resolver = Resolver;

  dependencies = {
    services: ["session", "intl", "notification", "alexandria-config"],
  };
}

loadInitializers(EmberAlexandriaEngine, modulePrefix);
