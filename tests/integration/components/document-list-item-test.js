import { click, doubleClick, render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Integration | Component | document-list-item", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.document = {
      title: "some document",
      modifiedAt: new Date("December 1, 2000 00:00:00"),
      createdByUser: "some group",
    };
    this.isSelected = false;
    this.onClickDocument = () => {};
    this.onDoubleClickDocument = () => {};

    await render(hbs`
      <DocumentListItem
        @document={{this.document}}
        @selectedDocuments={{this.selectedDocuments}}
        @isSelected={{this.isSelected}}
        @onClickDocument={{this.onClickDocument}}
        @onDoubleClickDocument={{this.onDoubleClickDocument}}
      />
    `);
  });

  test("it renders all the required fields for a document", async function (assert) {
    assert.dom().includesText("some document");
    assert.dom().includesText("12/01/2000");
    assert.dom().includesText("some group");
  });

  test("it fires the onClickDocument function with the correct parameter", async function (assert) {
    this.set("onClickDocument", (arg) => {
      assert.strictEqual(arg, this.document);
    });

    await click("[data-test-document-list-item]");
  });

  test("it fires the onDoubleClickDocument function with the correct parameter", async function (assert) {
    this.set("onDoubleClickDocument", (arg) => {
      assert.strictEqual(arg, this.document);
    });

    await doubleClick("[data-test-document-list-item]");
  });
});
