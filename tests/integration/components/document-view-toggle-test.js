import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | document-view-toggle", function (hooks) {
  setupRenderingTest(hooks, { resolver });

  test("it renders", async function (assert) {
    this.set("viewList", true);

    await render(hbs`<DocumentViewToggle />`);

    assert.dom("[data-test-toggle]").isVisible();
    assert.dom("[data-test-toggle] svg").exists();
  });
});
