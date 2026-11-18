import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Model | signature request", function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test("it exists", function (assert) {
    const store = this.owner.lookup("service:store");
    const model = store.createRecord("signature-request", {});
    assert.ok(model);
  });
});
