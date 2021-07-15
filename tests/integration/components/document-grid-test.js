import { render } from "@ember/test-helpers";
import setupRenderingTest from "dummy/tests/helpers/setup-rendering-test";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, todo } from "qunit";

module("Integration | Component | document-grid", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  todo("it renders a document grid", async function (assert) {
    this.server.createList("document", 3);

    await render(hbs`<DocumentGrid />`);

    assert.dom(".document-grid").exists();
  });
});
