import Service from "@ember/service";
import { render, click } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import fileSaver from "file-saver";
import { module, test } from "qunit";
import sinon from "sinon";

const mockDocumentsService = class DocumentsService extends Service {
  deselectDocument() {
    return [];
  }
};

module("Integration | Component | document-card", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register("service:documents", mockDocumentsService);
  });

  test("it renders document card", async function (assert) {
    this.document = { title: "test1" };
    await render(hbs`<DocumentCard @document={{this.document}}/>`);

    assert.dom("[data-test-file-icon]").exists();
    assert.dom("[data-test-title]").hasText(this.document.title);
    assert.dom("[data-test-context-menu]").isNotVisible();
    assert.dom("[data-test-delete]").isNotVisible();
    assert.dom("[data-test-download]").isNotVisible();

    await click("[data-test-context-menu-trigger]");
    assert.dom("[data-test-context-menu]").isVisible();
    assert.dom("[data-test-delete]").isVisible();
    assert.dom("[data-test-download]").isVisible();
  });

  test("download file", async function (assert) {
    // eslint-disable-next-line import/no-named-as-default-member
    const fileSaverStub = sinon.stub(fileSaver, "saveAs");

    const downloadUrl = "http://earh.planet";
    const title = "test1.txt";

    this.document = {
      title,
      files: [{ name: "foo.txt", variant: "original", downloadUrl }],
    };
    await render(hbs`<DocumentCard @document={{this.document}}/>`);
    await click("[data-test-context-menu-trigger]");
    await click("[data-test-download]");
    assert.strictEqual(
      fileSaverStub.args[0][0],
      downloadUrl,
      "saveAs was called with correct downloadUrl",
    );
    assert.strictEqual(
      fileSaverStub.args[0][1],
      title,
      "saveAs was called with correct file name",
    );
  });

  test("delete file", async function (assert) {
    this.document = {
      id: 1,
      // eslint-disable-next-line import/no-named-as-default-member
      destroyRecord: sinon.fake(),
    };
    await render(hbs`<DocumentCard @document={{this.document}}/>`);

    await click("[data-test-context-menu-trigger]");
    await click("[data-test-delete]");
    await click("[data-test-delete-confirm]");
    assert.ok(
      this.document.destroyRecord.calledOnce,
      "destroyRecord was called once",
    );
  });

  test("thumbnail", async function (assert) {
    this.document = {
      thumbnail: "some-url",
    };
    await render(hbs`<DocumentCard @document={{this.document}}/>`);

    assert.dom("[data-test-file-icon]").doesNotExist();
    assert
      .dom("[data-test-thumbnail]")
      .hasAttribute("data-src", this.document.thumbnail);
  });
});
