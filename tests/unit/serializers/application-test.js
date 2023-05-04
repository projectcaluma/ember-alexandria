import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Serializer | application", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const store = this.owner.lookup("service:store");
    const serializer = store.serializerFor("application");

    assert.ok(serializer);
  });
});
