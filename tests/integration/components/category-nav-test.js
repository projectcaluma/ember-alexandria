import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test, todo } from "qunit";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | category-nav", function (hooks) {
  setupRenderingTest(hooks, { resolver });
  setupIntl(hooks, "en");

  test("it renders category nav", async function (assert) {
    const store = this.owner.lookup("service:store");
    store.findAll = () => [{ name: "category1" }, { name: "category2" }];

    await render(hbs`<CategoryNav />`);

    assert.dom("[data-test-nav-title]").hasText("Categories");
    assert.dom("[data-test-all-files]").exists();
    assert.dom("[data-test-category]").exists({ count: 2 });
  });

  todo("it renders loading categories", async function (assert) {
    // Dont know how to test the loading state since the datafetching is on render and the test waits until rendering is finished.
    const store = this.owner.lookup("service:store");
    store.findAll = () => {};

    await render(hbs`<CategoryNav />`);

    assert.dom("[data-test-skeleton-category]").exists({ count: 5 });

    assert.dom("[data-test-nav-title]").hasText("Categories");
    assert.dom("[data-test-all-files]").exists();
    assert.dom("[data-test-category]").doesNotExist();
  });
});
