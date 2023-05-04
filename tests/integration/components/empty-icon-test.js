import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

module("Integration | Component | empty-icon", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    await render(hbs`<EmptyIcon />`);

    assert.dom(this.element).hasText("We found nothing...");
    assert.dom(this.element).hasStyle({ color: "rgb(102, 102, 102)" });
  });
});
