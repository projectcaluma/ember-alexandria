import { render, triggerEvent } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";
import { fake, stub } from "sinon";

module("Integration | Component | category-nav/category", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders a category", async function (assert) {
    this.category = { name: "test", color: "#f00", id: 1 };
    await render(hbs`<CategoryNav::Category @category={{this.category}}/>`, {
      owner: this.engine,
    });

    assert.dom("[data-test-name]").hasText("test");
    assert.dom("[data-test-icon]").hasStyle({ color: "rgb(255, 0, 0)" });
  });

  test("it renders an active category", async function (assert) {
    this.category = { id: "test", name: "test", color: "#f00" };
    await render(
      hbs`<CategoryNav::Category @category={{this.category}} @selected="test"/>`,
      { owner: this.engine },
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

    const router = this.engine.lookup("service:router");

    stub(router, "currentRouteName").get(() => null);
    router.transitionTo = fake();

    await render(
      hbs`<CategoryNav::Category @category={{this.category}} data-test-drop />`,
      { owner: this.engine },
    );

    await triggerEvent("[data-test-drop]", "drop", {
      dataTransfer: {
        getData: () => documents.map((d) => d.id).join(","),
        files: [],
      },
    });

    assert.strictEqual(router.transitionTo.callCount, 1);
    assert.deepEqual(router.transitionTo.args[0][1], {
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

  test("it uploads on drop", async function (assert) {
    const category = this.server.create("category");
    const store = this.engine.lookup("service:store");
    const fakeUpload = fake();
    this.engine.lookup("service:alexandria-documents").upload = fakeUpload;

    this.category = await store.findRecord("category", category.id);
    await store.findAll("document"); // the code uses peekRecord

    await render(
      hbs`<CategoryNav::Category @category={{this.category}} data-test-drop />`,
      { owner: this.engine },
    );

    await triggerEvent("[data-test-drop]", "drop", {
      dataTransfer: {
        getData: () => {},
        files: [new File(["Ember Rules!"], "test-file.txt")],
      },
    });

    assert.strictEqual(fakeUpload.callCount, 1);
  });
});
