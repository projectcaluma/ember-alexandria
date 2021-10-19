import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { module, test } from "qunit";

import setupRequestAssertions from "../helpers/assert-request";

module("Acceptance | nav", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupRequestAssertions(hooks);

  test("navigating categories", async function (assert) {
    this.server.createList("category", 5);
    this.server.createList("document", 5);

    await visit("/");

    assert.dom("[data-test-category]").exists({ count: 5 });
    assert.equal(currentURL(), "/");

    await click("[data-test-category]:last-child [data-test-link]");
    assert.equal(currentURL(), "/?category=5");
  });

  test("navigating categories clears any sorting, filtering and selection querys", async function (assert) {
    const categories = this.server.createList("category", 2);
    const tag = this.server.create("tag");
    this.server.create("document", { category: categories[0], tags: [tag] });
    await visit(
      `/?category=${categories[0].id}&sort=title&tags=${tag.name}&document=1`
    );
    await click("[data-test-category]:last-child [data-test-link]");

    assert.equal(currentURL(), `/?category=${categories[1].id}&sort=title`);
  });

  test("search", async function (assert) {
    assert.expect(3);

    await visit("/");

    assert.equal(currentURL(), "/");

    this.assertRequest("GET", "/api/v1/documents", (request) => {
      assert.equal(
        request.queryParams["filter[search]"],
        "search-text",
        "documents are fetched with search"
      );
    });
    await fillIn("[data-test-search-input]", "search-text");
    assert.equal(currentURL(), "/?search=search-text");
  });
});
