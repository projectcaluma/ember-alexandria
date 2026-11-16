import { render, triggerEvent } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";
import { fake, stub } from "sinon";
import UIkit from "uikit";

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
    const documents = [
      // Case 1: File with ext in name & allowed mimType
      this.server.create("document", {
        categoryId: oldCategory.id,
        title: "TestTextFile",
        files: [
          this.server.create("file", {
            name: "test.txt",
            mimeType: "text/plain",
          }),
        ],
      }),
      // Case 2: File with not allowed mimeType
      this.server.create("document", {
        categoryId: oldCategory.id,
        title: "TestVid",
        files: [
          this.server.create("file", {
            name: "TestVid.webm",
            mimeType: "video/webm",
          }),
        ],
      }),
    ];
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
        files: [
          new File(["Thumbnail"], "test-file.txt", { type: "text/plain" }),
        ],
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
    // Since the mimetype of the second one doesn't match the default allowed
    // mime types of the category factories, only one file should be moved.
    assert.deepEqual(
      documents.map((d) => d.category.id),
      [category.id, oldCategory.id],
    );
  });

  test("it refreshes documents after a failed move is copied", async function (assert) {
    const category = this.server.create("category");
    const oldCategory = this.server.create("category");
    const document = this.server.create("document", {
      categoryId: oldCategory.id,
      title: "Test document",
      files: [
        this.server.create("file", {
          name: "test.txt",
          mimeType: "text/plain",
        }),
      ],
    });

    const store = this.owner.lookup("service:store");
    const documentsService = this.engine.lookup("service:alexandria-documents");
    const config = this.engine.lookup("service:alexandria-config");
    const router = this.engine.lookup("service:router");

    this.category = await store.findRecord("category", category.id);
    await store.findAll("document");

    config.enableMoveCopyFallback = true;

    stub(router, "currentRouteName").get(() => null);
    router.transitionTo = fake();

    const moveStub = stub(documentsService, "move").resolves([
      {
        error: 403,
        document: store.peekRecord("document", document.id),
      },
    ]);

    const confirmStub = stub(UIkit.modal, "confirm").resolves();

    try {
      await render(
        hbs`<CategoryNav::Category @category={{this.category}} data-test-drop />`,
        { owner: this.engine },
      );

      const previousRevision = documentsService.documentListRevision;

      await triggerEvent("[data-test-drop]", "drop", {
        dataTransfer: {
          getData: () => document.id,
          files: [],
        },
      });

      assert.true(moveStub.calledOnce, "move was attempted");
      assert.true(confirmStub.calledOnce, "copy confirmation was shown");

      assert.strictEqual(
        documentsService.documentListRevision,
        previousRevision + 1,
        "document list refresh was triggered after copying",
      );

      const copiedDocuments = store
        .peekAll("document")
        .filter(
          (doc) => doc.id !== document.id && doc.category.id === category.id,
        );

      assert.strictEqual(
        copiedDocuments.length,
        1,
        "a copy was added to the target category",
      );

      assert.deepEqual(
        router.transitionTo.args[0][1],
        {
          queryParams: {
            category: category.id,
          },
        },
        "navigation targets the copied document's category",
      );
    } finally {
      confirmStub.restore();
      moveStub.restore();
    }
  });

  test("it uploads on drop", async function (assert) {
    const category = this.server.create("category");
    const store = this.engine.lookup("service:store");
    const fakeUpload = fake.returns([1]);
    this.engine.lookup("service:alexandria-documents").upload = fakeUpload;

    const router = this.engine.lookup("service:router");
    stub(router, "currentRouteName").get(() => null);
    router.transitionTo = fake();

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
    assert.strictEqual(router.transitionTo.callCount, 1);
  });
});
