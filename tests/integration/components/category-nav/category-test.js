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
    const oldCategory = this.server.create("category");
    // Case 1: File with ext in name & allowed mimType
    const documents = this.server.createList("document", 3, {
      categoryId: oldCategory.id,
      title: "test.txt",
      files: this.server.createList("file", 1, {
        name: "test.txt",
        mimeType: "text/plain",
      }),
    });
    // Case 2: File with allowed mimeType
    documents[1].update({
      title: "TestGif",
      files: this.server.createList("file", 1, {
        name: "TestFileWithoutEXT",
        mimeType: "image/gif",
      }),
    });
    // Case 3: File with allowed ext in name, but not allowed mimeType
    documents[2].update({
      title: "TestVid",
      files: this.server.createList("file", 1, {
        name: "TestVid.jpg",
        mimeType: "video/webm",
      }),
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
        // sometimes browser send a file as well (e.g. when dragging a thumbnail) - this should be ignored
        files: [new File(["Thumbnail"], "test-file.docx")],
      },
    });

    assert.strictEqual(router.transitionTo.callCount, 1);
    assert.deepEqual(router.transitionTo.args[0][1], {
      queryParams: {
        category: category.id,
        document: documents.map((d) => d.id).join(),
        marks: [],
        search: undefined,
        tags: [],
      },
    });
    // Since the mimetype of the third one doesn't match the default allowed
    // mime types of the category factories, only one file should be moved.
    assert.deepEqual(
      documents.map((d) => d.category.id),
      [category.id, category.id, oldCategory.id],
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
        getData: () => "",
        files: [new File(["Ember Rules!"], "test-file.txt")],
      },
    });

    assert.strictEqual(fakeUpload.callCount, 1);
  });
});
