import { render, triggerEvent } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";
import { fake } from "sinon";

module("Integration | Component | category-nav/category", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders a category", async function (assert) {
    this.category = { name: "test", color: "#f00", id: 1 };
    await render(hbs`<CategoryNav::Category @category={{this.category}}/>`);

    assert.dom("[data-test-name]").hasText("test");
    assert.dom("[data-test-icon]").hasStyle({ color: "rgb(255, 0, 0)" });
  });

  test("it renders an active category", async function (assert) {
    this.category = { id: "test", name: "test", color: "#f00" };
    await render(
      hbs`<CategoryNav::Category @category={{this.category}} @selected="test"/>`,
    );

    assert.dom("[data-test-name]").hasText("test");
    assert.dom("[data-test-icon]").hasStyle({ color: "rgb(255, 0, 0)" });
    assert.dom("[data-test-link]").hasClass("active");
  });

  test("it moves dropped documents to new category", async function (assert) {
    const category = this.server.create("category");
    const documents = this.server.createList("document", 2, {
      categoryId: this.server.create("category").id,
    });

    const store = this.owner.lookup("service:store");

    this.category = await store.findRecord("category", category.id);
    await store.findAll("document"); // the code uses peekRecord

    const fakeTransition = fake();
    this.owner.lookup("service:router").transitionTo = fakeTransition;

    await render(
      hbs`<CategoryNav::Category @category={{this.category}} data-test-drop />`,
    );

    await triggerEvent("[data-test-drop]", "drop", {
      dataTransfer: { getData: () => documents.map((d) => d.id).join(",") },
    });

    assert.strictEqual(fakeTransition.callCount, 1);
    assert.deepEqual(fakeTransition.args[0][1], {
      queryParams: {
        category: this.category.id,
        document: documents.map((d) => d.id).join(),
        marks: [],
        search: undefined,
        tags: [],
      },
    });
    assert.deepEqual(
      documents.map((d) => d.category.id),
      [this.category.id, this.category.id],
    );
  });
});
