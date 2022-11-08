import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

module("Integration | Component | drop/item", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    await render(hbs`<Drop::Item @label="test"/>`);

    assert.dom(this.element).hasText("test");
  });

  test("it renders with block", async function (assert) {
    await render(hbs`
      <Drop::Item>
        test
      </Drop::Item>
    `);

    assert.dom(this.element).hasText("test");
  });
});
