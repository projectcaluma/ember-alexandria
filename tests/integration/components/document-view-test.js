import Service from "@ember/service";
import { render, click } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

class MockDocumentsService extends Service {
  @tracked selectedDocuments = [];
}

module("Integration | Component | document-view", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.owner.register("service:documents", MockDocumentsService);
  });

  test("it renders the documents when in grid view", async function (assert) {
    this.server.createList("document", 3);

    await render(hbs`<DocumentView />`);

    await click("[data-test-toggle]");

    assert.dom("[data-test-upload]").exists();
    assert.dom("[data-test-empty]").doesNotExist();

    assert.dom("[data-test-document]").exists({ count: 3 });
    assert
      .dom("[data-test-document]")
      .doesNotHaveClass("document-card--selected");
  });

  test("it renders an empty document view", async function (assert) {
    await render(hbs`<DocumentView />`);
    await click("[data-test-toggle]");

    assert.dom("[data-test-upload]").exists();
    assert.dom("[data-test-empty]").exists();
  });

  test("select document", async function (assert) {
    const documents = this.server.createList("document", 3);
    const docService = this.owner.lookup("service:documents");

    docService.selectedDocuments = [documents[0]];

    await render(hbs`<DocumentView />`);
    await click("[data-test-toggle]");

    assert.dom("[data-test-empty]").doesNotExist();
    assert.dom("[data-test-document]").exists({ count: 3 });
    assert
      .dom("[data-test-document-container]:nth-child(1) div")
      .hasClass("document-card--selected");
    assert
      .dom("[data-test-document-container]:nth-child(2) div")
      .doesNotHaveClass("document-card--selected");
    assert
      .dom("[data-test-document-container]:nth-child(3) div")
      .doesNotHaveClass("document-card--selected");
  });

  test("pass filters", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    this.filters = { title: "test", description: "bla" };

    await render(hbs`<DocumentView @filters={{this.filters}} />`);

    assert.strictEqual(requests.length, 3, "store handled 3 requests");
    assert.deepEqual(requests[0].queryParams, {
      "filter[title]": "test",
      "filter[description]": "bla",
      include: "category,files,tags",
      sort: "title",
    });
  });
});
