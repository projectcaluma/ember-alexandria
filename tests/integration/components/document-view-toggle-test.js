import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | document-view-toggle", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.set("viewList", true);

    await render(hbs`<DocumentViewToggle />`);

    assert.dom("[data-test-toggle]").isVisible();
    assert.dom("[data-test-toggle] svg").exists();
  });
});
