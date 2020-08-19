import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | empty-icon", function (hooks) {
  setupRenderingTest(hooks, { resolver });
  setupIntl(hooks, "en");

  test("it renders", async function (assert) {
    await render(hbs`<EmptyIcon />`);

    assert.dom(this.element).hasText("We found nothing...");
    assert.dom(this.element).hasStyle({ color: "rgb(102, 102, 102)" });
  });
});
