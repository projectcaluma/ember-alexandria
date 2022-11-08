import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, todo } from "qunit";

module("Integration | Component | side-panel-toggle", function (hooks) {
  setupRenderingTest(hooks);

  todo("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<SidePanelToggle />`);

    assert.dom(this.element).hasText("");

    // Template block usage:
    await render(hbs`
      <SidePanelToggle>
        template block text
      </SidePanelToggle>
    `);

    assert.dom(this.element).hasText("template block text");
  });
});
