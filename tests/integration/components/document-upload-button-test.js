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

  test("upload with predefined category", async function (assert) {
    const store = this.owner.lookup("service:store");

    const save = sinon.fake();
    store.createRecord = sinon.fake.returns({ save });
    this.category = { id: 1 };

    await render(hbs`<DocumentUploadButton @category={{this.category}} />`);

    assert.dom("[data-test-input]").exists({ count: 1 });

    await triggerEvent("[data-test-input]", "change", {
      files: [new File(["Ember Rules!"], "test-file.txt")],
    });

    assert.equal(save.callCount, 2, "save was called twice");
    assert.equal(
      store.createRecord.callCount,
      2,
      "createRecord was called twice"
    );

    assert.equal(
      save.firstCall.thisValue.title,
      "test-file.txt",
      "title was correctly set on document"
    );
    assert.equal(
      store.createRecord.secondCall.args[1].name,
      "test-file.txt",
      "correct model type for file"
    );
    assert.equal(
      store.createRecord.secondCall.args[1].type,
      "original",
      "correct model type for file"
    );
  });

  test.todo("upload without predefined category", async function (assert) {
    const store = this.owner.lookup("service:store");

    store.createRecord = sinon.fake();
    store.peekAll = sinon.fake.returns([
      { id: 1, name: "c1", color: "#f00" },
      { id: 2, name: "c2", color: "#0f0" },
      { id: 3, name: "c3", color: "#00f" },
    ]);

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

    await triggerEvent(
      "[data-test-upload-category]:nth-child(2) [data-test-input]",
      "change",
      {
        files: [new File(["Ember Rules!"], "test-file.txt")],
      }
    );

    assert.ok(store.peekAll.called, "peekAll was called");

    assert.equal(
      store.createRecord.firstCall.args[1].category.id,
      2,
      "document was created with correct category"
    );
  });
});
