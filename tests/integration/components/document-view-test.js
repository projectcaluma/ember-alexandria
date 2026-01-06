import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";
import { fake, stub } from "sinon";

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

  test("sort configuration", async function (assert) {
    const router = this.engine.lookup("service:router");
    stub(router, "currentRouteName").get(() => null);
    router.transitionTo = fake();
    await render(hbs`<DocumentView @listView={{ true }} />`, {
      owner: this.engine,
    });

    // default sort is title ascending.
    assert.dom("[data-test-sort-key='title']").exists();
    assert.dom("[data-test-sort-direction='']").exists();
    // click to change sort direction to descending.
    await click("[data-test-sort='title']");
    assert.dom("[data-test-sort-key='title']").exists();
    assert.dom("[data-test-sort-direction='-']").exists();
    // next click to change sort key back to ascending.
    await click("[data-test-sort='title']");
    assert.dom("[data-test-sort-key='title']").exists();
    assert.dom("[data-test-sort-direction='']").exists();

    // sort by category (using a multi sort).
    await click("[data-test-sort='category']");
    assert.dom("[data-test-sort-key='category__name']").exists();
    assert.dom("[data-test-sort-direction='']").exists();
    // next click on category to change sort direction to descending.
    await click("[data-test-sort='category']");
    assert.dom("[data-test-sort-key='category__name']").exists();
    assert.dom("[data-test-sort-direction='-']").exists();
    // next click will go to the next sort key in the multi sort (category__sort).
    await click("[data-test-sort='category']");
    assert.dom("[data-test-sort-key='category__sort']").exists();
    assert.dom("[data-test-sort-direction='']").exists();
    // next click will go to the next sort key because category__sort does not allow
    // descending sort.
    // the next sort key is category__test with descending sort because it does
    // not allow ascending sort.
    await click("[data-test-sort='category']");
    assert.dom("[data-test-sort-key='category__test']").exists();
    assert.dom("[data-test-sort-direction='-']").exists();

    // next click will go back to the first sort (name)
    await click("[data-test-sort='category']");
    assert.dom("[data-test-sort-key='category__name']").exists();
    assert.dom("[data-test-sort-direction='']").exists();
  });
});
