import { render } from "@ember/test-helpers";
import setupRenderingTest from "dummy/tests/helpers/setup-rendering-test";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Integration | Component | document-view", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders a document view", async function (assert) {
    this.server.createList("document", 3);

    await render(hbs`<Documentview />`);

    assert.dom("[data-test-upload]").exists();
    assert.dom("[data-test-empty]").doesNotExist();
    assert.dom("[data-test-document]").exists({ count: 3 });
    assert.dom("[data-test-document]").doesNotHaveClass("selected");

    assert.dom("[data-test-details]").exists();
    assert.dom("[data-test-details]").hasClass("closed");
  });

  test("it renders an empty document view", async function (assert) {
    await render(hbs`<Documentview />`);

    assert.dom("[data-test-upload]").exists();
    assert.dom("[data-test-empty]").exists();
    assert.dom("[data-test-details]").exists();
    assert.dom("[data-test-details]").hasClass("closed");
  });

  test("select document", async function (assert) {
    this.server.createList("document", 3);

    await render(hbs`<Documentview @selectedDocumentId="2" />`);

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

    await render(hbs`<Documentview @filters={{this.filters}} />`);

    assert.equal(requests.length, 3, "store handled 3 requests");
    assert.deepEqual(requests[1].queryParams, {
      "filter[title]": "test",
      "filter[description]": "bla",
      include: "category,files,tags",
    });
  });
});
