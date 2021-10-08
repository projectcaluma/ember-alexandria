/* eslint-disable import/no-named-as-default-member */
import { render, triggerEvent } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import sinon from "sinon";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | document-upload-button", function (hooks) {
  setupRenderingTest(hooks, { resolver });

  hooks.beforeEach(function () {
    this.store = this.owner.lookup("service:store");
    this.docService = this.owner.lookup("service:documents");
    this.uploadFnMock = sinon.fake();
    this.docService.upload = this.uploadFnMock;
  });

  test("upload a file with a predefined category", async function (assert) {
    assert.expect(4);

    this.category = this.store.createRecord("category");

    await render(hbs`<DocumentUploadButton @category={{this.category}} />`);

    assert.dom("[data-test-input]").exists({ count: 1 });

    const dummyFile = new File(["Ember Rules!"], "test-file.txt");
    await triggerEvent("[data-test-input]", "change", {
      files: [dummyFile],
    });

    assert.equal(
      this.uploadFnMock.callCount,
      1,
      "documents.upload was called once"
    );
    assert.equal(
      this.uploadFnMock.args[0][0],
      this.category,
      "documents.upload was called with the correct category"
    );
    assert.equal(
      this.uploadFnMock.args[0][1][0].name,
      dummyFile.name,
      "documents.upload was called with the correct file"
    );
  });

  test("upload without predefined category", async function (assert) {
    const store = this.owner.lookup("service:store");
    store.createRecord("category", { name: "c1", color: "#f00" });
    const secondToLastCategory = store.createRecord("category", {
      name: "c2",
      color: "#0f0",
    });
    store.createRecord("category", {
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
      }
    );

    assert.equal(
      this.uploadFnMock.args[0][0],
      secondToLastCategory,
      "documents.upload was called with the correct category"
    );
  });
});
