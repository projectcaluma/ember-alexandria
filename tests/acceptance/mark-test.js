import { visit, click } from "@ember/test-helpers";
import { setupApplicationTest } from "dummy/tests/helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Acceptance | mark", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("selecting mark", async function (assert) {
    const [document] = await this.server.createList("document", 3);
    const [mark] = await this.server.createList("mark", 2);

    await visit("/");

    assert
      .dom(
        `[data-test-document-list-item-id="${document.id}"] [data-test-document-mark="${mark.id}"]`,
      )
      .doesNotExist("the mark is not present in the document list");
    assert.dom("[data-test-mark]").doesNotExist("no mark filter is present");

    await click(`[data-test-document-list-item-id="${document.id}"]`);
    await click(`[data-test-add-mark="${mark.id}"]`);

    assert
      .dom(
        `[data-test-document-list-item-id="${document.id}"] [data-test-document-mark="${mark.id}"]`,
      )
      .exists("the mark is present in the document list");
    assert
      .dom("[data-test-mark]")
      .exists({ count: 1 }, "one mark filter is present");
    assert
      .dom(`[data-test-mark-id="${mark.id}"]`)
      .exists("selected mark filter is present");
  });
});
