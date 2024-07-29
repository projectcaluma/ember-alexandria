import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import hbs from "htmlbars-inline-precompile";
import { module, test } from "qunit";

module("Integration | Modifier | set-style", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders style", async function (assert) {
    await render(hbs`<div {{set-style color="#f00" display="flex"}}></div>`, {
      owner: this.engine,
    });

    assert.dom("div").hasStyle({ color: "rgb(255, 0, 0)", display: "flex" });
  });
});
