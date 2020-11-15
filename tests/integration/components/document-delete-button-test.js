import { render, click, waitFor } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, skip } from "qunit";
import sinon from "sinon";

module("Integration | Component | document-delete-button", function (hooks) {
  setupRenderingTest(hooks);

  skip("delete document", async function (assert) {
    this.document = {
      title: "Test",
      destroyRecord: sinon.fake(),
    };

    await render(hbs`
      <DocumentDeleteButton @document={{this.document}} as |showDialog|>
        <button
          {{on "click" showDialog}}
          data-test-delete
          type="button"
        >Delete</button>
      </DocumentDeleteButton>
    `);

    await click("[data-test-delete]");
    await waitFor("[data-test-delete-confirm]", { timeout: 1000 });
    await click("[data-test-delete-submit]");

    assert.ok(
      this.selectedDocument.destroyRecord.calledOnce,
      "destroyRecord was called once"
    );
  });
});
