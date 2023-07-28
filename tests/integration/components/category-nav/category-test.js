import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

module("Integration | Component | category-nav/category", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders a category", async function (assert) {
    this.category = { name: "test", color: "#f00", id: 1 };
    await render(hbs`<CategoryNav::Category @category={{this.category}}/>`);

    assert.dom("[data-test-name]").hasText("test");
    assert.dom("[data-test-icon]").hasStyle({ color: "rgb(255, 0, 0)" });
  });

  test("it renders an active category", async function (assert) {
    this.category = { name: "test", color: "#f00" };
    await render(
      hbs`<CategoryNav::Category @category={{this.category}} @selected={{true}}/>`,
    );

    assert.dom("[data-test-name]").hasText("test");
    assert.dom("[data-test-icon]").hasStyle({ color: "rgb(255, 0, 0)" });
    assert.dom("[data-test-link]").hasClass("active");
  });
});
