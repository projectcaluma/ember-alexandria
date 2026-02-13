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
      modifiedAt: "2000-12-01T05:00:00.000Z",
      createdByUser: "some user",
      marks: [],
    };
    this.columns = {
      title: { label: "document-title" },
      modifiedAt: { label: "modified-at" },
      createdByUser: { label: "created-by-user" },
    };
    this.isSelected = false;
    this.onClickDocument = fake();
    this.onDoubleClickDocument = fake();
    this.onDragStart = fake();

    await render(
      hbs`
      <DocumentListItem
        @columns={{this.columns}}
        @document={{this.document}}
        @selectedDocuments={{this.selectedDocuments}}
        @isSelected={{this.isSelected}}
        @onClickDocument={{this.onClickDocument}}
        @onDoubleClickDocument={{this.onDoubleClickDocument}}
        @onDragStart={{this.onDragStart}}
      />
    `,
      { owner: this.engine },
    );
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
