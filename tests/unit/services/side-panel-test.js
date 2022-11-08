import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | side-panel", function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    const service = this.owner.lookup("service:side-panel");
    assert.ok(service);
  });
});
