import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
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
