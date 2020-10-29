import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Serializer | document", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const store = this.owner.lookup("service:store");
    const serializer = store.serializerFor("document");

    assert.ok(serializer);
  });

  test("it serializes records", function (assert) {
    const store = this.owner.lookup("service:store");
    const record = store.createRecord("document", {});

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
