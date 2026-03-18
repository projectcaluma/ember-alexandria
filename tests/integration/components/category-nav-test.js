import { render, settled } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Integration | Component | category-nav", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders category nav", async function (assert) {
    this.server.createList("category", 2);

    await render(hbs`<CategoryNav />`, { owner: this.engine });

    assert.dom("[data-test-nav-title]").hasText("Categories");
    assert.dom("[data-test-all-files]").exists();
    assert.dom("[data-test-category]").exists({ count: 2 });
  });

  test("document count filters stale documents from other instances", async function (assert) {
    const category = this.server.create("category");

    // register config service that filters by instance_id: "1"
    const configService = this.engine.lookup("service:alexandria-config");
    Object.defineProperty(configService, "modelMetaFilters", {
      get: () => ({ document: [{ key: "instance_id", value: "1" }] }),
      configurable: true,
    });

    await render(hbs`<CategoryNav />`, { owner: this.engine });

    // push documents after rendering so the category record is already in the store
    const store = this.engine.lookup("service:store");
    store.push({
      data: [
        {
          id: "1",
          type: "document",
          attributes: {
            title: "Instance_1_Doc_1",
            metainfo: { instance_id: "1" },
          },
          relationships: {
            category: { data: { type: "category", id: category.id } },
          },
        },
        {
          id: "2",
          type: "document",
          attributes: {
            title: "Instance_1_Doc_2",
            metainfo: { instance_id: "1" },
          },
          relationships: {
            category: { data: { type: "category", id: category.id } },
          },
        },
        {
          id: "3",
          type: "document",
          attributes: {
            title: "Instance_2_Doc",
            metainfo: { instance_id: "2" },
          },
          relationships: {
            category: { data: { type: "category", id: category.id } },
          },
        },
      ],
    });
    await settled();

    assert.dom("[data-test-all-files] [data-test-document-count]").hasText("2");
    assert.dom("[data-test-category] [data-test-document-count]").hasText("2");
  });

  test.skip("it renders loading categories", async function (assert) {
    // Dont know how to test the loading state since the datafetching is on render and the test waits until rendering is finished.
    this.server.createList("category", 2);

    await render(hbs`<CategoryNav />`, { owner: this.engine });

    assert.dom("[data-test-skeleton-category]").exists({ count: 5 });

    assert.dom("[data-test-nav-title]").hasText("Categories");
    assert.dom("[data-test-all-files]").exists();
    assert.dom("[data-test-category]").doesNotExist();
  });
});
