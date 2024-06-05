import { setupTest } from "dummy/tests/helpers";
import { module, test } from "qunit";

module("Unit | Controller | index", function (hooks) {
  setupTest(hooks);

  test("compute document filters", function (assert) {
    const controller = this.owner.lookup("controller:index");
    controller.activeGroup = "group";
    controller.search = "test";
    controller.category = 1;
    controller.config = {
      modelMetaFilters: {
        document: [{ key: "instance_id", value: "1" }],
      },
    };

    assert.deepEqual(controller.documentFilters, {
      activeGroup: "group",
      category: 1,
      metainfo: JSON.stringify([{ key: "instance_id", value: "1" }]),
      search: "test",
      tags: undefined,
      marks: undefined,
    });
  });
});
