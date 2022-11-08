import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

module("Integration | Helper | resolve-user", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.id = "1234";

    await render(hbs`{{resolve-group this.id}}`);

    assert.dom(this.element).hasText("1234");
  });
});
