import makeServer from "dummy/mirage/config";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupIntl } from "ember-intl/test-support";
import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
  setupTest as upstreamSetupTest,
} from "ember-qunit";
import Resolver from "ember-resolver";

const engineResolver = engineResolverFor("ember-alexandria");

// https://github.com/miragejs/ember-cli-mirage/issues/1737#issuecomment-531976128
class CustomResolver extends Resolver {
  namespace = { modulePrefix: "dummy" };
  resolve(...args) {
    return super.resolve(...args) ?? engineResolver.resolve(...args);
  }
}

const resolver = CustomResolver.create();

function setupMirageServer(hooks) {
  hooks.beforeEach(function () {
    this.owner.register("mirage:make-server", makeServer);
  });
}

function setupEnginesRouter(hooks) {
  // ember-engines-router-service is not being used in unit / integration tests
  // as there is no context of an engine. In order for the tests to work, we
  // fake the `externalRouter` property by assigning the original router service
  // to it.
  hooks.beforeEach(function () {
    const router = this.owner.lookup("service:router");
    router.externalRouter = router;
  });
}

// This file exists to provide wrappers around ember-qunit's / ember-mocha's
// test setup functions. This way, you can easily extend the setup that is
// needed per test type.

function setupApplicationTest(hooks, options) {
  upstreamSetupApplicationTest(hooks, options);
  setupIntl(hooks, "en");
}

function setupRenderingTest(hooks, options = {}) {
  upstreamSetupRenderingTest(hooks, { resolver, ...options });
  setupMirageServer(hooks);
  setupIntl(hooks, "en");
  setupEnginesRouter(hooks);
}

function setupTest(hooks, options = {}) {
  upstreamSetupTest(hooks, { resolver, ...options });
  setupMirageServer(hooks);
  setupIntl(hooks, "en");
  setupEnginesRouter(hooks);
}

export { setupApplicationTest, setupRenderingTest, setupTest };
