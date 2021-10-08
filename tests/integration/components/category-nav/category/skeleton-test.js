import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module(
  "Integration | Component | category-nav/category/skeleton",
  function (hooks) {
    setupRenderingTest(hooks, { resolver });

    test("it renders skeleton category", async function (assert) {
      await render(
        hbs`<CategoryNav::Category::Skeleton @animationDelay="100ms"/>`
      );

      assert.dom("[data-test-icon]").hasStyle({ "animation-delay": "0.1s" });
      assert.dom("[data-test-text]").hasStyle({ "animation-delay": "0.1s" });
    });
  }
);
