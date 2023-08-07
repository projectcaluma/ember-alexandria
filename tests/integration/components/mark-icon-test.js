import { htmlSafe } from "@ember/template";
import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

module("Integration | Component | mark-icon", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders uikit", async function (assert) {
    this.set("mark", {
      icon: "bolt",
    });
    await render(hbs`<MarkIcon @mark={{this.mark}}/>`);

    assert.dom("span").hasClass("uk-icon");
  });
  test("it renders htmlsafe", async function (assert) {
    this.set("mark", {
      icon: htmlSafe("<p>foo<p>"),
    });
    await render(hbs`<MarkIcon @mark={{this.mark}}/>`);

    assert.dom(this.element).hasText("foo");
  });
});
