import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Serializer | file", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const store = this.owner.lookup("service:store");
    const serializer = store.serializerFor("file");

    assert.ok(serializer);
  });

  test("it serializes records", function (assert) {
    const store = this.owner.lookup("service:store");
    const record = store.createRecord("file", {});

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
