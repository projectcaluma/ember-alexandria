import { setupTest } from "dummy/tests/helpers";
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
    const file = {
      name: "foo",
      variant: "original",
    };
    const record = store.createRecord("file", file);

    const serializedRecord = record.serialize();

    assert.deepEqual(Object.fromEntries(serializedRecord.entries()), {
      ...file,
      document: "undefined",
    });
  });
});
