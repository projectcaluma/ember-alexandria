import Service from "@ember/service";
import { render, click } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import setupRenderingTest from "dummy/tests/helpers/setup-rendering-test";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { module, test } from "qunit";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

class MockDocumentsService extends Service {
  @tracked selectedDocuments = [];
}

module("Integration | Component | document-view", function (hooks) {
  setupRenderingTest(hooks, { resolver });
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
    assert.dom("[data-test-document]").doesNotHaveClass("selected");
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
      .hasClass("selected");
    assert
      .dom("[data-test-document-container]:nth-child(2) div")
      .doesNotHaveClass("selected");
    assert
      .dom("[data-test-document-container]:nth-child(3) div")
      .doesNotHaveClass("selected");
  });

  test("pass filters", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    this.filters = { title: "test", description: "bla" };

    await render(hbs`<DocumentView @filters={{this.filters}} />`);

    assert.strictEqual(requests.length, 2, "store handled 2 requests");
    assert.deepEqual(requests[1].queryParams, {
      "filter[title]": "test",
      "filter[description]": "bla",
      include: "category,files,tags",
      sort: "title",
    });
  });
});
