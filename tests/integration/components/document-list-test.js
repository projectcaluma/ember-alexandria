// import { render } from "@ember/test-helpers";
// import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | document-list", function (hooks) {
  setupRenderingTest(hooks, { resolver });
  setupIntl(hooks, "en");
  setupMirage(hooks);

  // test("it renders the supplied list of documents with the correct title", async function (assert) {
  //   const createdDocs = this.server.createList("document", 3);
  //   this.set("fetchedDocuments", createdDocs);
  //   // await render(hbs`<DocumentList />`);
  //   // assert.equal(this.element.textContent.trim(), "");
  //   // Template block usage:
  //   await render(hbs`
  //     <DocumentList/>
  //   `);
  //   assert.equal(this.element.textContent.trim(), createdDocs[0]);
  // });

  test("it renders the supplied list of documents with the correct title");
  test("clicking the sorting buttons enables the correct sorting function");
});
