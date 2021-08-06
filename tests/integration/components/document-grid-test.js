import { render } from "@ember/test-helpers";
import setupRenderingTest from "dummy/tests/helpers/setup-rendering-test";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { module, todo } from "qunit";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | document-grid", function (hooks) {
  setupRenderingTest(hooks, { resolver });
  setupMirage(hooks);

  todo("it renders a document grid", async function (assert) {
    this.server.createList("document", 3);

    await render(hbs`<DocumentGrid />`);

    assert.dom(".document-grid").exists();
  });
});
