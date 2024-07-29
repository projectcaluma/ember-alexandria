import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

module("Integration | Component | drop", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    await render(hbs`<Drop />`, { owner: this.engine });

    assert
      .dom("[data-test-drop]")
      .hasAttribute("uk-drop", "mode: click; pos: bottom-left; offset: 5;");
  });

  test("it renders with style args", async function (assert) {
    await render(hbs`<Drop @width="uk-width-1" @position="top-left"/>`, {
      owner: this.engine,
    });

    assert
      .dom("[data-test-drop]")
      .hasAttribute("uk-drop", "mode: click; pos: top-left; offset: 5;");
    assert.dom("[data-test-drop]").hasClass("uk-width-1");
  });
});
