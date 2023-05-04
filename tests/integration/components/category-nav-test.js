import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Integration | Component | category-nav", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders category nav", async function (assert) {
    this.server.createList("category", 2);

    await render(hbs`<CategoryNav />`);

    assert.dom("[data-test-nav-title]").hasText("Categories");
    assert.dom("[data-test-all-files]").exists();
    assert.dom("[data-test-category]").exists({ count: 2 });
  });

  test.skip("it renders loading categories", async function (assert) {
    // Dont know how to test the loading state since the datafetching is on render and the test waits until rendering is finished.
    this.server.createList("category", 2);

    await render(hbs`<CategoryNav />`);

    assert.dom("[data-test-skeleton-category]").exists({ count: 5 });

    assert.dom("[data-test-nav-title]").hasText("Categories");
    assert.dom("[data-test-all-files]").exists();
    assert.dom("[data-test-category]").doesNotExist();
  });
});
