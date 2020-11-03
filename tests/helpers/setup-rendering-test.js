import config from "dummy/mirage/config";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupRenderingTest } from "ember-qunit";
import Resolver from "ember-resolver";

const modulePrefix = "ember-alexandria";

/** @see https://github.com/miragejs/ember-cli-mirage/issues/1737#issuecomment-531976128 */
export default function setupCustomRenderingTest(hooks) {
  const engineResolver = engineResolverFor(modulePrefix);

  const resolver = Resolver.extend({
    // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
    namespace: { modulePrefix: "dummy" },
    resolve(...args) {
      const resolved = this._super(...args);
      if (resolved) {
        return resolved;
      }

      return engineResolver.resolve(...args);
    },
  }).create();

  setupRenderingTest(hooks, { resolver });

  hooks.beforeEach(function () {
    this.owner.register("mirage:base-config", config);
  });
}
