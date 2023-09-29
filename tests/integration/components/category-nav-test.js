import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { findAll } from "ember-data-resources";
import { module, test } from "qunit";

module("Integration | Component | category-nav", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders category nav", async function (assert) {
    this.server.createList("category", 2);
    this.set(
      "categories",
      findAll(this, "category", () => {}),
    );

    await render(hbs`<CategoryNav @categories={{this.categories}}/>`);

    assert.dom("[data-test-nav-title]").hasText("Categories");
    assert.dom("[data-test-all-files]").exists();
    assert.dom("[data-test-category]").exists({ count: 2 });
  });

  test.skip("it renders loading categories", async function (assert) {
    this.set("categories", { isLoading: true });

    await render(hbs`<CategoryNav @categories={{this.categories}}/>`);

    assert.dom("[data-test-skeleton-category]").exists({ count: 5 });

    assert.dom("[data-test-nav-title]").hasText("Categories");
    assert.dom("[data-test-all-files]").exists();
    assert.dom("[data-test-category]").doesNotExist();
  });
});
