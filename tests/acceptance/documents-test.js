import {
  visit,
  currentURL,
  click,
  fillIn,
  triggerEvent,
  settled,
} from "@ember/test-helpers";
import { setupApplicationTest } from "dummy/tests/helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setLocale, t } from "ember-intl/test-support";
import * as fileSaver from "file-saver";
import { module, test } from "qunit";
import { stub } from "sinon";

import setupRequestAssertions from "../helpers/assert-request";

module("Acceptance | documents", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupRequestAssertions(hooks);

  // Mirage relationships are not working properly
  test("document grid displays documents", async function (assert) {
    const documents = this.server.createList("document", 5);
    const file = this.server.create("file", {
      variant: "original",
      downloadUrl: "test-thumbnail",
    });
    file.update({
      renderings: [
        this.server.create("file", {
          variant: "thumbnail",
          downloadUrl: "test-thumbnail",
        }),
      ],
    });
    documents[1].update({
      files: [file],
    });

    await visit("/");
    await click("[data-test-toggle-side-panel]");
    assert.dom("[data-test-document]").exists({ count: 5 });
    assert
      .dom("[data-test-document-container]:first-child [data-test-title]")
      .hasText(documents[0].title);
    assert
      .dom("[data-test-document-container]:first-child [data-test-thumbnail]")
      .doesNotExist();

    assert
      .dom("[data-test-document-container]:nth-child(2) [data-test-title]")
      .hasText(documents[1].title);
    assert
      .dom("[data-test-document-container]:nth-child(2) [data-test-thumbnail]")
      .hasAttribute("data-src", "test-thumbnail");
  });

  test("select document in the grid view", async function (assert) {
    const [document] = this.server.createList("document", 2);

    await visit("/");
    await click("[data-test-toggle-side-panel]");

    assert.dom("[data-test-single-doc-details]").isNotVisible();

    assert
      .dom("[data-test-document-container]:first-child [data-test-document]")
      .doesNotHaveClass("document-card--selected");

    await click(
      "[data-test-document-container]:first-child [data-test-document]",
    );

    assert.strictEqual(
      currentURL(),
      `/?document=${document.id}&listView=false`,
      "url is set to currently selected document",
    );

    assert.dom("[data-test-single-doc-details]").isVisible();

    assert
      .dom("[data-test-document-container]:first-child [data-test-document]")
      .hasClass("document-card--selected");

    assert
      .dom("[data-test-single-doc-details] [data-test-title]")
      .hasText(document.title);

    await click("[data-test-close]");
    assert.dom("[data-test-document-side-panel]").hasClass("closed");
  });

  test("document detail edit title", async function (assert) {
    const document = this.server.create("document");
    this.server.create("file", {
      variant: "original",
      name: "some-file-after-1.pdf",
      createdAt: new Date(2025, 2, 1),
      document,
    });
    // oldest original file
    const originalFile = this.server.create("file", {
      variant: "original",
      name: document.title,
      createdAt: new Date(2025, 1, 1),
      document,
    });
    this.server.create("file", {
      variant: "original",
      name: "some-other-after-2.pdf",
      createdAt: new Date(2025, 3, 1),
      document,
    });

    await visit(`/`);
    await click("[data-test-toggle-side-panel]");
    setLocale("en");

    await click(
      "[data-test-document-container]:first-child [data-test-document]",
    );

    assert
      .dom("[data-test-single-doc-details] [data-test-title]")
      .hasText(document.title);

    assert.dom("[data-test-title-input]").doesNotExist();
    assert.dom("[data-test-original-filename]").doesNotExist();

    await click("[data-test-single-doc-details] [data-test-edit-title]");
    assert.dom("[data-test-title-input]").hasValue(document.title);

    await fillIn("[data-test-title-input]", "new title");
    this.assertRequest("PATCH", "/api/v1/documents/:id", (request) => {
      assert.strictEqual(
        request.params.id,
        document.id,
        "patching the correct document",
      );
      assert.strictEqual(
        JSON.parse(request.requestBody).data.attributes.title,
        "new title",
        "new title is set",
      );
    });
    await click("[data-test-single-doc-details] [data-test-save]");
    assert.dom("[data-test-title-input]").doesNotExist();
    assert.dom("[data-test-original-filename]").exists();
    assert
      .dom("[data-test-original-filename]")
      .containsText(`Original: ${originalFile.name}`);
  });

  test("document detail delete", async function (assert) {
    const document = this.server.create("document");

    await visit(`/`);

    await click("[data-test-document-list-item]:first-of-type");

    setTimeout(() => {}, 2000);
    this.assertRequest("DELETE", "/api/v1/documents/:id", (request) => {
      assert.strictEqual(
        request.params.id,
        document.id,
        "deleting the correct document",
      );
    });
    await click("[data-test-single-doc-details] [data-test-delete]");
    await click("[data-test-delete-confirm]");
    assert.strictEqual(currentURL(), "/", "document is removed from url");
    assert.dom("[data-test-document]").doesNotExist();
  });

  test("copy single document", async function (assert) {
    const document = this.server.create("document");

    await visit(`/`);

    assert.dom("[data-test-document-list-item]").exists({ count: 1 });
    await click("[data-test-document-list-item]:nth-of-type(1)");

    this.assertRequest("POST", "/api/v1/documents/:id/copy", (request) => {
      assert.strictEqual(
        request.params.id,
        document.id,
        "copying the correct document",
      );
    });

    await click("[data-test-single-doc-details] [data-test-copy]");
    assert.dom("[data-test-document-list-item]").exists({ count: 2 });
  });

  test("copy multiple documents", async function (assert) {
    const documents = this.server.createList("document", 2);

    await visit(`/`);

    assert.dom("[data-test-document-list-item]").exists({ count: 2 });

    await click("[data-test-document-list-item]:nth-of-type(1)");
    await click("[data-test-document-list-item]:nth-of-type(2)", {
      shiftKey: true,
    });

    const assertFn = (document) => (request) => {
      assert.strictEqual(
        request.params.id,
        document.id,
        "copying the correct document",
      );
    };

    this.assertRequests(
      "POST",
      "/api/v1/documents/:id/copy",
      documents.map(assertFn),
    );

    await click("[data-test-multi-doc-details] [data-test-copy]");
    assert.dom("[data-test-document-list-item]").exists({ count: 4 });
  });

  test("upload file", async function (assert) {
    this.server.create("category");

    await visit("/?category=1");
    setLocale("en");

    assert.dom("[data-test-document]").doesNotExist();
    this.assertRequest("POST", "/api/v1/documents", (request) => {
      request.requestBody
        .get("data")
        .text()
        .then((data) => {
          assert.strictEqual(
            JSON.parse(data).title,
            "test-file.txt",
            "correct title is set",
          );
        });
    });
    await triggerEvent("[data-test-upload] [data-test-input]", "change", {
      files: [
        new File(["Ember Rules!"], "test-file.txt", { type: "text/plain" }),
      ],
    });
    assert.dom("[data-test-document-list-item]").exists({ count: 1 });
  });

  test("replace file", async function (assert) {
    const document = this.server.create("document");
    await visit(`/?document=${document.id}`);

    assert.dom("[data-test-file]").doesNotExist();

    this.assertRequest("POST", "/api/v1/files", (request) => {
      const name = request.requestBody.get("name");
      const variant = request.requestBody.get("variant");
      assert.strictEqual(name, "test-file.txt");
      assert.strictEqual(variant, "original");
    });
    await triggerEvent("[data-test-replace]", "change", {
      files: [new File(["Ember Rules!"], "test-file.txt")],
    });

    assert.dom("[data-test-file]").exists({ count: 1 });
  });

  test("context menu delete", async function (assert) {
    this.server.createList("document", 5);
    await visit("/");
    await click("[data-test-toggle-side-panel]");

    assert.dom("[data-test-document]").exists({ count: 5 });
    await click(
      "[data-test-document]:first-child [data-test-context-menu-trigger]",
    );
    this.assertRequest("DELETE", "/api/v1/documents/:id", (request) => {
      assert.strictEqual(
        request.params.id,
        "1",
        "deleting the correct document",
      );
    });
    await click(
      "[data-test-document]:first-child [data-test-context-menu] [data-test-delete]",
    );
    await click("[data-test-delete-confirm]");
    assert.dom("[data-test-document]").exists({ count: 4 });
  });

  test("downloading multiple documents as a zip", async function (assert) {
    this.server
      .createList("document", 5)
      .forEach((document) => this.server.create("file", { document }));

    const fileSaverStub = stub(fileSaver, "saveAs");

    await visit("/");
    await click("[data-test-toggle-side-panel]");
    await click("[data-test-document]", { shiftKey: true });
    await click(
      "[data-test-document-container]:nth-child(3) [data-test-document]",
      { shiftKey: true },
    );

    assert
      .dom("[data-test-download-button]")
      .hasText(t("alexandria.document-download.button", { numDocs: 3 }));

    this.assertRequest("GET", "/api/v1/files/multi", (request) => {
      assert.strictEqual(
        request.queryParams["filter[files]"],
        "1,2,3",
        "requesting the correct documents as a zip",
      );
    });

    await click("[data-test-download-button]");
    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled();

    assert.true(fileSaverStub.args[0][0] instanceof Blob);
    assert.strictEqual(fileSaverStub.args[0][1], "Download-3-files.zip");
  });

  test("selecting documents with CTRL A", async function (assert) {
    this.server.createList("document", 3);
    await visit("/");
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "a", ctrlKey: true }),
    );
    await triggerEvent(window, "keydown", "a", {
      ctrlKey: true,
    });

    assert
      .dom("[data-test-document-list-item].document-list-item--selected")
      .exists({ count: 3 });
  });

  test.skip("deselecting documents with Escape", async function (assert) {
    this.server.createList("document", 3);
    await visit("/");
    await click("[data-test-document-list-item]:first-child");
    assert
      .dom("[data-test-document-list-item].document-list-item--selected")
      .exists({ count: 1 });

    // window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await triggerEvent("[data-test-document-list-item]", "keydown", "Escape");
    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled();

    assert
      .dom("[data-test-document-list-item].document-list-item--selected")
      .doesNotExist();
  });

  test("clicking a sortable column changes the icon", async function (assert) {
    await visit("/");
    assert
      .dom('[data-test-sort="title"] svg')
      .hasAttribute("data-icon", "sort");

    await click('[data-test-sort="title"]');
    assert
      .dom('[data-test-sort="title"] svg')
      .hasAttribute("data-icon", "sort-down");

    await click('[data-test-sort="title"]');
    assert
      .dom('[data-test-sort="title"] svg')
      .hasAttribute("data-icon", "sort-up");
  });
});
