import makeServer from "dummy/mirage/config";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
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

// This file exists to provide wrappers around ember-qunit's / ember-mocha's
// test setup functions. This way, you can easily extend the setup that is
// needed per test type.

function setupApplicationTest(hooks, options) {
  upstreamSetupApplicationTest(hooks, options);

  // Additional setup for application tests can be done here.
  //
  // For example, if you need an authenticated session for each
  // application test, you could do:
  //
  // hooks.beforeEach(async function () {
  //   await authenticateSession(); // ember-simple-auth
  // });
  //
  // This is also a good place to call test setup functions coming
  // from other addons:
  //
  // setupIntl(hooks); // ember-intl
  // setupMirage(hooks); // ember-cli-mirage
}

function setupRenderingTest(hooks, options = {}) {
  upstreamSetupRenderingTest(hooks, { ...options, resolver });

  hooks.beforeEach(function () {
    this.owner.register("mirage:make-server", makeServer);
  });
}

function setupTest(hooks, options = {}) {
  upstreamSetupTest(hooks, { ...options, resolver });

  hooks.beforeEach(function () {
    this.owner.register("mirage:make-server", makeServer);
  });
}

export { setupApplicationTest, setupRenderingTest, setupTest };
