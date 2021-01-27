import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Helper | resolve-user", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.id = "1234";

    await render(hbs`{{resolve-group this.id}}`);

    assert.equal(this.element.textContent.trim(), "1234");
  });
});
