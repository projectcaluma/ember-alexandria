import { render, click } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";
import { fake, stub } from "sinon";

module("Integration | Component | document-delete-button", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const router = this.engine.lookup("service:router");

    stub(router, "currentRouteName").get(() => null);
    router.transitionTo = fake();
  });

  test("delete document", async function (assert) {
    this.document = {
      id: 1,
      title: "Test",
      destroyRecord() {
        assert.step("destroy test");
      },
    };

    this.onCancel = () => assert.step("cancel");
    this.onConfirm = () => assert.step("confirm");

    await render(
      hbs`
    <DocumentDeleteButton
      @docsToDelete={{this.document}}
      @onConfirm={{this.onConfirm}}
      @onCancel={{this.onCancel}}
      as |showDialog|
    >
      <button
        {{on "click" showDialog}}
        data-test-delete
        type="button"
      >
        Delete
      </button>
    </DocumentDeleteButton>
    `,
      { owner: this.engine },
    );

    await click("[data-test-delete]");
    await click("[data-test-delete-cancel]");

    await click("[data-test-delete]");
    await click("[data-test-delete-confirm]");

    assert.verifySteps(["cancel", "confirm", "destroy test"]);
  });

  test("delete document multiple", async function (assert) {
    this.documents = [
      {
        id: 1,
        title: "Test",
        destroyRecord() {
          assert.step("destroy test");
        },
      },
      {
        id: 2,
        title: "Bar",
        destroyRecord() {
          assert.step("destroy bar");
        },
      },
    ];

    this.onCancel = () => assert.step("cancel");
    this.onConfirm = () => assert.step("confirm");

    await render(
      hbs`
    <DocumentDeleteButton
      @docsToDelete={{this.documents}}
      @onConfirm={{this.onConfirm}}
      @onCancel={{this.onCancel}}
      as |showDialog|
    >
      <button
        {{on "click" showDialog}}
        data-test-delete
        type="button"
      >
        Delete
      </button>
    </DocumentDeleteButton>
    `,
      { owner: this.engine },
    );

    await click("[data-test-delete]");
    await click("[data-test-delete-cancel]");

    await click("[data-test-delete]");
    await click("[data-test-delete-confirm]");

    assert.verifySteps(["cancel", "confirm", "destroy test", "destroy bar"]);
  });
});
