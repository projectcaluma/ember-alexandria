import { render, click } from "@ember/test-helpers";
import setupRenderingTest from "dummy/tests/helpers/setup-rendering-test";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

module("Integration | Component | document-delete-button", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, "en");

  test("delete document", async function (assert) {
    this.document = {
      id: 1,
      title: "Test",
      destroyRecord() {},
    };

    this.onCancel = () => assert.step("cancel");
    this.onConfirm = () => assert.step("confirm");

    await render(hbs`
    <DocumentDeleteButton
      @document={{this.document}}
      @onConfirm={{this.onConfirm}}
      @onCancel={{this.onCancel}}
      as |showDialog|
    >
      <button
      {{on "click" showDialog}}
      data-test-delete
      type="button"
      >Delete</button>
    </DocumentDeleteButton>
    `);

    await click("[data-test-delete]");
    await click("[data-test-delete-cancel]");

    await click("[data-test-delete]");
    await click("[data-test-delete-confirm]");

    assert.verifySteps(["cancel", "confirm"]);
  });
});
