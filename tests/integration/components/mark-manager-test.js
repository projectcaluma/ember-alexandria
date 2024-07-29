import { render, click } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";
import { fake } from "sinon";

module("Integration | Component | mark-manager", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.server.createList("mark", 2);
  });

  test("it renders mark manager", async function (assert) {
    this.documents = [
      {
        title: "Test",
        category: { color: "#F00" },
        createdAt: new Date(1998, 11, 11),
        createdByUser: "user1",
        createdByGroup: "group1",
        files: [
          {
            variant: "original",
            name: "some-file.pdf",
            createdByUser: null,
            downloadUrl: "http://test.com",
          },
        ],
        marks: [],
        save: fake(),
      },
    ];

    await render(hbs`<MarkManager @documents={{this.documents}} />`, {
      owner: this.engine,
    });

    assert.dom("label").exists({ count: 2 });
    assert.dom("input").isNotChecked();

    await click("input");

    assert.dom("input").isChecked();

    await click("input");

    assert.dom("input").isNotChecked();
  });
});
