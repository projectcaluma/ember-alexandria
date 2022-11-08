import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Integration | Component | document-grid", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders a document grid", async function (assert) {
    this.server.createList("document", 3);

    await render(hbs`<DocumentGrid />`);

    assert.dom(".document-grid").exists();
  });
});
