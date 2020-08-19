import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | document-card/skeleton", function (hooks) {
  setupRenderingTest(hooks, { resolver });

  test("it renders skeleton document card", async function (assert) {
    await render(hbs`<DocumentCard::Skeleton @animationDelay="100ms"/>`);

    assert.dom("[data-test-img]").hasStyle({ "animation-delay": "0.1s" });
    assert.dom("[data-test-text]").hasStyle({ "animation-delay": "0.1s" });
    assert
      .dom("[data-test-ellipsis]")
      .hasStyle({ color: "rgb(244, 244, 244)" });
  });
});
