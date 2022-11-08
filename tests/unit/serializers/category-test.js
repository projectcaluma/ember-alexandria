import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Serializer | category", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const store = this.owner.lookup("service:store");
    const serializer = store.serializerFor("category");

    assert.ok(serializer);
  });

  test("it serializes records", function (assert) {
    const store = this.owner.lookup("service:store");
    const record = store.createRecord("category", {});

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
