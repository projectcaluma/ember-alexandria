import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupApplicationTest } from "dummy/tests/helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

import setupRequestAssertions from "../helpers/assert-request";

module("Acceptance | tag", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupRequestAssertions(hooks);

  test("creating a tag updates tag filters", async function (assert) {
    const [document] = await this.server.createList("document", 3);

    await visit("/");

    assert.dom("[data-test-tag]").doesNotExist("no tag filter is present");

    await click(`[data-test-document-list-item-id="${document.id}"]`);

    await fillIn("[data-test-tag-input]", "Apple");
    await click("[data-test-tag-add]");

    assert
      .dom("[data-test-tag]")
      .exists({ count: 1 }, "one tag filter is present");
  });

  test("selecting a tag updates tag filters", async function (assert) {
    const [document] = await this.server.createList("document", 3);
    const tag = await this.server.create("tag");

    await visit("/");

    assert.dom("[data-test-tag]").doesNotExist("no tag filter is present");

    await click(`[data-test-document-list-item-id="${document.id}"]`);

    await fillIn("[data-test-tag-input]", tag.name);
    await click(`[data-test-tag-existing="${tag.id}"]`);

    assert
      .dom("[data-test-tag]")
      .exists({ count: 1 }, "one tag filter is present");
    assert
      .dom(`[data-test-tag-id="${tag.id}"]`)
      .exists("selected tag filter is present");
  });

  test("changing the category clears the tag selection", async function (assert) {
    const documents = await this.server.createList("document", 3);
    const tag = await this.server.create("tag");
    const category = await this.server.create("category");

    documents[0].update({
      tags: [tag],
    });

    await visit("/");

    assert.dom(`.tag`).exists("the tag does not have the selected class");

    await click(`[data-test-tag-id="${tag.id}"]`);

    assert
      .dom(`[data-test-tag-id="${tag.id}"]`)
      .hasClass("tag--active", "the tag does has the selected class");
    assert.strictEqual(
      currentURL(),
      `/?tags=%5B%22${tag.id}%22%5D`,
      "tag has been selected and is present in the URL",
    );

    await click(`[data-test-category-id="${category.id}"]`);

    assert.strictEqual(
      currentURL(),
      `/?category=${category.id}`,
      "the category has been set and the tags queryParam has been cleared",
    );

    assert
      .dom(".tag--active")
      .doesNotExist("the tag does not have the selected class");
  });

  test("selecting a document does not clear the tag selection", async function (assert) {
    const documents = await this.server.createList("document", 2);
    const tag = await this.server.create("tag");

    documents[0].update({
      tags: [tag],
    });

    await visit("/");
    await click(`[data-test-tag-id="${tag.id}"]`);

    assert
      .dom(`[data-test-tag-id="${tag.id}"]`)
      .hasClass("tag--active", "the tag does has the selected class");

    await click(`[data-test-document-list-item-id="${documents[0].id}"]`);

    assert
      .dom(`[data-test-tag-id="${tag.id}"]`)
      .hasClass("tag--active", "the tag still has the selected class");
  });
});
