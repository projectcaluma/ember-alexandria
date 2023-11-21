import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Adapter | file", function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test("it exists", function (assert) {
    const adapter = this.owner.lookup("adapter:file");
    assert.ok(adapter);
  });
});
