import { render, triggerEvent } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";
import { fake } from "sinon";

module("Integration | Component | document-upload-button", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.uploadFnMock = fake();
    this.owner.lookup("service:alexandria-documents").upload =
      this.uploadFnMock;
  });

  test("upload a file with a predefined category", async function (assert) {
    this.category = this.server.create("category");

    await render(hbs`<DocumentUploadButton @categoryId={{this.category}} />`);

    assert.dom("[data-test-input]").exists({ count: 1 });

    const dummyFile = new File(["Ember Rules!"], "test-file.txt");
    await triggerEvent("[data-test-input]", "change", {
      files: [dummyFile],
    });

    assert.strictEqual(
      this.uploadFnMock.callCount,
      1,
      "documents.upload was called once",
    );
    assert.strictEqual(
      this.uploadFnMock.args[0][0],
      this.category,
      "documents.upload was called with the correct category",
    );
    assert.strictEqual(
      this.uploadFnMock.args[0][1][0].name,
      dummyFile.name,
      "documents.upload was called with the correct file",
    );
  });

  test("upload without predefined category", async function (assert) {
    this.server.create("category", {
      name: "c1",
      color: "#f00",
    });
    const secondToLastCategory = this.server.create("category", {
      name: "c2",
      color: "#0f0",
    });
    this.server.create("category", {
      name: "c3",
      color: "#00f",
    });

    await render(hbs`<DocumentUploadButton/>`);

    assert.dom("[data-test-upload-category]").exists({ count: 3 });
    assert
      .dom("[data-test-upload-category]:first-child [data-test-folder-icon]")
      .hasStyle({ color: "rgb(255, 0, 0)" });
    assert
      .dom("[data-test-upload-category]:nth-child(2) [data-test-folder-icon]")
      .hasStyle({ color: "rgb(0, 255, 0)" });
    assert
      .dom("[data-test-upload-category]:last-child [data-test-folder-icon]")
      .hasStyle({ color: "rgb(0, 0, 255)" });

    const dummyFile = new File(["Ember Rules!"], "test-file.txt");
    await triggerEvent(
      "[data-test-upload-category]:nth-child(2) [data-test-input]",
      "change",
      {
        files: [dummyFile],
      },
    );

    assert.strictEqual(
      this.uploadFnMock.args[0][0].id,
      secondToLastCategory.id,
      "documents.upload was called with the correct category",
    );
  });
});
