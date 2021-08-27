import Service from "@ember/service";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import sinon from "sinon";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

class TagServiceStub extends Service {
  fetchAllTags = {
    perform: sinon.fake(),
  };
}

module("Integration | Component | documents-side-panel", function (hooks) {
  setupRenderingTest(hooks, { resolver });
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.owner.register("service:tags", TagServiceStub);
  });

  test("it doesnt show the download button if no documents are selected", async function (assert) {
    this.selectedDocuments = [];
    await render(
      hbs`<DocumentsSidePanel @selectedDocuments={{this.selectedDocuments}}/>`
    );
    assert.dom("[data-test-download-button]").isNotVisible();
  });

  test("it shows a download button if 1 document is selected", async function (assert) {
    this.selectedDocuments = [this.server.create("document")];
    await render(
      hbs`<DocumentsSidePanel @selectedDocuments={{this.selectedDocuments}}/>`
    );
    assert.dom("[data-test-download-button]").isVisible();
  });

  test("it shows a download button if multiple document is selected", async function (assert) {
    this.selectedDocuments = this.server.createList("document", 3);
    await render(
      hbs`<DocumentsSidePanel @selectedDocuments={{this.selectedDocuments}}/>`
    );
    assert.dom("[data-test-download-button]").isVisible();
  });
});
