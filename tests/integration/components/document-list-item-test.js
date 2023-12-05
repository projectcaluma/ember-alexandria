import { click, doubleClick, render, triggerEvent } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";
import { fake } from "sinon";

module("Integration | Component | document-list-item", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.document = {
      title: "some document",
      modifiedAt: new Date("December 1, 2000 00:00:00"),
      createdByUser: "some user",
      marks: [],
    };
    this.isSelected = false;
    this.onClickDocument = fake();
    this.onDoubleClickDocument = fake();
    this.onDragStart = fake();

    await render(hbs`
      <DocumentListItem
        @document={{this.document}}
        @selectedDocuments={{this.selectedDocuments}}
        @isSelected={{this.isSelected}}
        @onClickDocument={{this.onClickDocument}}
        @onDoubleClickDocument={{this.onDoubleClickDocument}}
        @onDragStart={{this.onDragStart}}
      />
    `);
  });

  test("it renders all the required fields for a document", async function (assert) {
    assert.dom().includesText("some document");
    assert.dom().includesText("12/01/2000");
    assert.dom().includesText("SOME USER");
  });

  test("it fires the onClickDocument function with the correct parameter", async function (assert) {
    await click("[data-test-document-list-item]");

    assert.strictEqual(this.onClickDocument.callCount, 1);
    assert.deepEqual(this.onClickDocument.args[0][0], this.document);
  });

  test("it fires the onDoubleClickDocument function with the correct parameter", async function (assert) {
    await doubleClick("[data-test-document-list-item]");

    assert.strictEqual(this.onDoubleClickDocument.callCount, 1);
    assert.deepEqual(this.onDoubleClickDocument.args[0][0], this.document);
  });

  test("it fires the onDragStart function with the correct parameter", async function (assert) {
    await triggerEvent("[data-test-document-list-item]", "dragstart");

    assert.strictEqual(this.onDragStart.callCount, 1);
    assert.deepEqual(this.onDragStart.args[0][0], this.document);
  });
});
