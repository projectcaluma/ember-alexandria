import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, todo } from "qunit";

module("Integration | Component | zip-download", function (hooks) {
  setupRenderingTest(hooks);

  todo("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ZipDownload />`);

    assert.dom(this.element).hasText("");

    // Template block usage:
    await render(hbs`
      <ZipDownload>
        template block text
      </ZipDownload>
    `);

    assert.dom(this.element).hasText("template block text");
  });
});
