import { render, click } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";
import { fake } from "sinon";

module("Integration | Component | document-card", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders document card", async function (assert) {
    this.document = { title: "test1", marks: [] };
    await render(hbs`<DocumentCard @document={{this.document}}/>`);

    assert.dom("[data-test-file-icon]").exists();
    assert.dom("[data-test-title]").hasText(this.document.title);
    assert.dom("[data-test-context-menu]").isNotVisible();
    assert.dom("[data-test-delete]").isNotVisible();
    assert.dom("[data-test-download]").isNotVisible();

    await click("[data-test-context-menu-trigger]");
    assert.dom("[data-test-context-menu]").isVisible();
    assert.dom("[data-test-delete]").isVisible();
    assert.dom("[data-test-download]").isVisible();
  });

  test("delete file", async function (assert) {
    const transitionTo = fake();
    this.owner.lookup("service:router").transitionTo = transitionTo;

    const destroy = fake();
    this.document = {
      id: 1,
      marks: [],
      destroyRecord: async () => destroy(),
    };
    await render(hbs`<DocumentCard @document={{this.document}}/>`);

    await click("[data-test-context-menu-trigger]");
    await click("[data-test-delete]");
    await click("[data-test-delete-confirm]");
    assert.ok(destroy.calledOnce, "destroyRecord was called once");
    assert.ok(transitionTo.calledOnce, "transitionTo was called once");
  });

  test("thumbnail", async function (assert) {
    this.document = {
      thumbnail: { value: "some-url" },
      marks: [],
    };
    await render(hbs`<DocumentCard @document={{this.document}}/>`);

    assert.dom("[data-test-file-icon]").doesNotExist();
    assert
      .dom("[data-test-thumbnail]")
      .hasAttribute("data-src", this.document.thumbnail.value);
  });
});
