import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

module(
  "Integration | Component | category-nav/category/skeleton",
  function (hooks) {
    setupRenderingTest(hooks);

    test("it renders skeleton category", async function (assert) {
      await render(
        hbs`<CategoryNav::Category::Skeleton @animationDelay="100ms"/>`
      );

      assert.dom("[data-test-icon]").hasStyle({ "animation-delay": "0.1s" });
      assert.dom("[data-test-text]").hasStyle({ "animation-delay": "0.1s" });
    });
  }
);
