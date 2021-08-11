import { render, click, pauseTest } from "@ember/test-helpers";
import setupRenderingTest from "dummy/tests/helpers/setup-rendering-test";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { module, test } from "qunit";
import sinon from "sinon";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | document-view", function (hooks) {
  setupRenderingTest(hooks, { resolver });
  setupMirage(hooks);

  // test("it parses the route url and initialises the selected documents, grid view, sorting correctly");

  test("it renders a document view when in grid view", async function (assert) {
    this.server.createList("document", 3);

    await render(hbs`<DocumentView />`);
    await click("[data-test-toggle]");

    assert.dom("[data-test-upload]").exists();
    assert.dom("[data-test-empty]").doesNotExist();

    assert.dom("[data-test-document]").exists({ count: 3 });
    assert.dom("[data-test-document]").doesNotHaveClass("selected");
    assert.dom("[data-test-details]").exists();
    assert.dom("[data-test-details]").hasClass("closed");
  });

  test("it renders an empty document view", async function (assert) {
    await render(hbs`<DocumentView />`);
    await click("[data-test-toggle]");

    assert.dom("[data-test-upload]").exists();
    assert.dom("[data-test-empty]").exists();
    assert.dom("[data-test-details]").exists();
    assert.dom("[data-test-details]").hasClass("closed");
  });

  test("select document", async function (assert) {
    this.server.createList("document", 3);

    await render(hbs`<DocumentView @selectedDocumentId="2" />`);
    await click("[data-test-toggle]");

    assert.dom("[data-test-empty]").doesNotExist();
    assert.dom("[data-test-document]").exists({ count: 3 });
    assert
      .dom("div:first-child > [data-test-document-link] > [data-test-document]")
      .doesNotHaveClass("selected");
    assert
      .dom(
        "div:nth-child(2) > [data-test-document-link] > [data-test-document]"
      )
      .hasClass("selected");
    assert
      .dom("div:last-child > [data-test-document-link] > [data-test-document]")
      .doesNotHaveClass("selected");

    assert.dom("[data-test-details]").exists();
    assert.dom("[data-test-details]").doesNotHaveClass("closed");
  });

  test("pass filters", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    this.filters = { title: "test", description: "bla" };

    await render(hbs`<DocumentView @filters={{this.filters}} />`);

    assert.equal(requests.length, 3, "store handled 3 requests");
    assert.deepEqual(requests[1].queryParams, {
      "filter[title]": "test",
      "filter[description]": "bla",
      include: "category,files,tags",
    });
  });

  // test.todo("it sets the sort keys correctly");
  // test.todo("it selects a clicked row");
  // test.todo("it selects mutliple rows if clicked with ctrl");
  // test.todo("it selects all rows between two rows clicked with shift");
});
