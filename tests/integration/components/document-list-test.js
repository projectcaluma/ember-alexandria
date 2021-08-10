import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
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

  // @loading={{this.fetchDocuments}}
  // @selectedDocumentId={{this.selectedDocumentId}}
  // @fetchedDocuments={{this.fetchedDocuments}}
  // @setSort={{this.setSort}}
  // @selectedDocuments={{this.selectedDocuments}}
  // @onClickDocument={{this.handleDocumentSelection}}

  test("it renders the supplied list of documents with the correct title", async function (assert) {
    // const createdDocs = this.server.createList("document", 3);
    // console.log("🦠 createdDocs:", createdDocs);
    this.fetchedDocuments = [
      { title: "document1" },
      { title: "document2" },
      { title: "document3" },
    ];

    //   this.set("fetchedDocuments", createdDocs);
    //   // await render(hbs`<DocumentList />`);
    //   // assert.equal(this.element.textContent.trim(), "");
    //   // Template block usage:
    await render(hbs`
      <DocumentList
        @loading=false
        @selectedDocuments=[]
        @fetchedDocuments={{this.fetchedDocuments}}
        @setSort=""
      />
    `);
    assert.equal(this.element.textContent.trim(), "document1");
  });

  // test("clicking the sorting buttons enables the correct sorting function");
});
