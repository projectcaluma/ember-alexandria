import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import { module, test } from "qunit";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Modifier | set-style", function (hooks) {
  setupRenderingTest(hooks, { resolver });

  test("it renders style", async function (assert) {
    await render(hbs`<div {{set-style color="#f00" display="flex"}}></div>`);

    assert.dom("div").hasStyle({ color: "rgb(255, 0, 0)", display: "flex" });
  });
});
