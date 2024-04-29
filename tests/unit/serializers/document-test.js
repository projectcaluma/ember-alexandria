import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Serializer | document", function (hooks) {
  setupTest(hooks);

  test("it serializes records", function (assert) {
    const store = this.owner.lookup("service:store");
    const record = store.createRecord("document", {
      title: { en: "Foo" },
      content: "test",
    });

    const serializedRecord = record.serialize();

    // content attribute should be removed
    assert.deepEqual(serializedRecord, {
      data: {
        attributes: {
          "created-at": undefined,
          "created-by-group": undefined,
          "created-by-user": undefined,
          date: undefined,
          description: {},
          metainfo: undefined,
          "modified-at": undefined,
          "modified-by-group": undefined,
          "modified-by-user": undefined,
          title: {
            en: "Foo",
          },
        },
        type: "documents",
      },
    });
  });
});
