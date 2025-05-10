import { render, triggerEvent } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Integration | Component | document-view", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders an empty document view", async function (assert) {
    await render(hbs`<DocumentView @listView={{ false }} />`, {
      owner: this.engine,
    });

    assert.dom("[data-test-upload]").exists();
    assert.dom("[data-test-empty]").exists();
  });

  test("select document", async function (assert) {
    const documents = this.server.createList("document", 3);
    const docService = this.engine.lookup("service:alexandria-documents");

    docService.selectedDocuments = [documents[0]];

    await render(hbs`<DocumentView @listView={{ false }} />`, {
      owner: this.engine,
    });

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

    await render(hbs`<DocumentView @filters={{this.filters}} />`, {
      owner: this.engine,
    });

    assert.strictEqual(requests.length, 3, "store handled 3 requests");
    assert.deepEqual(requests[0].queryParams, {
      "filter[title]": "test",
      "filter[description]": "bla",
      include: "category,files,tags",
      sort: "title",
    });
  });

  test("copy documents within category", async function (assert) {
    const category = this.server.create("category", {
      allowedMimeTypes: ["image/png"],
    });
    const documents = this.server.createList("document", 3, {
      categoryId: category.id,
      title: "test.png",
    });

    const docService = this.engine.lookup("service:alexandria-documents");
    this.filters = { categories: category.id };

    const docSelection = documents.slice(0, 2);
    docService.selectedDocuments = docSelection;

    await render(
      hbs`
          <DocumentView @listView={{ false }} @filters={{ this.filters }} />`,
      {
        owner: this.engine,
      },
    );

    assert.dom("[data-test-empty]").doesNotExist();
    assert.dom("[data-test-document]").exists({ count: 3 });

    await triggerEvent("[data-drop-documents]", "drop", {
      ctrlKey: true,
      dataTransfer: {
        getData: () => docSelection.map((d) => d.id).join(","),
      },
    });

    assert.dom("[data-test-document]").exists({ count: 5 });
  });
});
