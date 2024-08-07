import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Integration | Component | documents-side-panel", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it doesnt show the download button if no documents are selected", async function (assert) {
    this.selectedDocuments = [];
    await render(
      hbs`<DocumentsSidePanel @selectedDocuments={{this.selectedDocuments}}/>`,
      { owner: this.engine },
    );
    assert.dom("[data-test-download-button]").isNotVisible();
  });

  test("it shows a download button if 1 document is selected", async function (assert) {
    this.selectedDocuments = [this.server.create("document")];
    await render(
      hbs`<DocumentsSidePanel @selectedDocuments={{this.selectedDocuments}}/>`,
      { owner: this.engine },
    );
    assert.dom("[data-test-download-button]").isVisible();
  });

  test("it shows a download button if multiple document is selected", async function (assert) {
    this.selectedDocuments = this.server.createList("document", 3);
    await render(
      hbs`<DocumentsSidePanel @selectedDocuments={{this.selectedDocuments}}/>`,
      { owner: this.engine },
    );
    assert.dom("[data-test-download-button]").isVisible();
  });
});
