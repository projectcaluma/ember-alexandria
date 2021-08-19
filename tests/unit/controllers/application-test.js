import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Unit | Controller | application", function (hooks) {
  // eslint-disable-next-line ember/no-restricted-resolver-tests
  setupTest(hooks, { resolver });

  test("compute document filters", function (assert) {
    const controller = this.owner.lookup("controller:application");
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
      meta: JSON.stringify([{ key: "instance_id", value: "1" }]),
      search: "test",
      sort: undefined,
      sortDirection: undefined,
      tags: undefined,
    });
  });
});
