import makeServer from "dummy/mirage/config";
import { setupEngine } from "ember-engines/test-support";
import { setupIntl } from "ember-intl/test-support";
import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
  setupTest as upstreamSetupTest,
} from "ember-qunit";

function setupMirageServer(hooks) {
  hooks.beforeEach(function () {
    this.owner.register("mirage:make-server", makeServer);
  });
}

// This file exists to provide wrappers around ember-qunit's
// test setup functions. This way, you can easily extend the setup that is
// needed per test type.

function setupApplicationTest(hooks, options) {
  upstreamSetupApplicationTest(hooks, options);
  setupIntl(hooks, "en");
}

function setupRenderingTest(hooks, options) {
  upstreamSetupRenderingTest(hooks, options);
  setupMirageServer(hooks);
  setupEngine(hooks, "ember-alexandria");
  setupIntl(hooks, "en");
}

function setupTest(hooks, options) {
  upstreamSetupTest(hooks, options);
  setupMirageServer(hooks);
  setupEngine(hooks, "ember-alexandria");
  setupIntl(hooks, "en");
}

export { setupApplicationTest, setupRenderingTest, setupTest };
