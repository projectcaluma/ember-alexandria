import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | drop", function (hooks) {
  setupRenderingTest(hooks, { resolver });

  test("it renders", async function (assert) {
    await render(hbs`<Drop />`);

    assert
      .dom("[data-test-drop]")
      .hasAttribute("uk-drop", "mode: click; pos: bottom-left; offset: 5;");
  });

  test("it renders with style args", async function (assert) {
    await render(hbs`<Drop @width="uk-width-1" @position="top-left"/>`);

    assert
      .dom("[data-test-drop]")
      .hasAttribute("uk-drop", "mode: click; pos: top-left; offset: 5;");
    assert.dom("[data-test-drop]").hasClass("uk-width-1");
  });
});
