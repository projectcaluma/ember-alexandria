import {
  visit,
  currentURL,
  click,
  fillIn,
  triggerEvent,
} from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl, setLocale } from "ember-intl/test-support";
import { setupApplicationTest } from "ember-qunit";
import { module, test } from "qunit";

import setupRequestAssertions from "../helpers/assert-request";

module("Acceptance | documents", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupRequestAssertions(hooks);
  setupIntl(hooks, ["en"]);

  test("document grid displays documents", async function (assert) {
    const documents = this.server.createList("document", 5);
    documents[1].update({
      files: [
        this.server.create("file", {
          type: "thumbnail",
          downloadUrl: "test-thumbnail",
        }),
      ],
    });

    assert.expect(5);

    await visit("/");
    await click("[data-test-toggle-side-panel]");
    assert.dom("[data-test-document]").exists({ count: 5 });
    assert
      .dom("[data-test-document-container]:first-child [data-test-title]")
      .hasText(documents[0].title.en);
    assert
      .dom("[data-test-document-container]:first-child [data-test-thumbnail]")
      .doesNotExist();

    assert
      .dom("[data-test-document-container]:nth-child(2) [data-test-title]")
      .hasText(documents[1].title.en);
    assert
      .dom("[data-test-document-container]:nth-child(2) [data-test-thumbnail]")
      .hasAttribute("data-src", "test-thumbnail");
  });

  test("select document in the grid view", async function (assert) {
    const [document] = this.server.createList("document", 2);
    assert.expect(7);

    await visit("/");
    await click("[data-test-toggle-side-panel]");

    assert.dom("[data-test-single-doc-details]").isNotVisible();

    assert
      .dom("[data-test-document-container]:first-child [data-test-document]")
      .doesNotHaveClass("selected");

    await click(
      "[data-test-document-container]:first-child [data-test-document]"
    );

    assert.equal(
      currentURL(),
      `/?document=${document.id}`,
      "url is set to currently selected document"
    );

    assert.dom("[data-test-single-doc-details]").isVisible();

    assert
      .dom("[data-test-document-container]:first-child [data-test-document]")
      .hasClass("selected");

    assert
      .dom("[data-test-single-doc-details] [data-test-title]")
      .hasText(document.title.en);

    await click("[data-test-close]");
    assert.dom("[data-test-document-side-panel]").hasClass("closed");
  });

  test("document detail edit title", async function (assert) {
    const document = this.server.create("document");
    assert.expect(6);
    await visit(`/`);
    await click("[data-test-toggle-side-panel]");
    setLocale("en");

    await click(
      "[data-test-document-container]:first-child [data-test-document]"
    );

    assert
      .dom("[data-test-single-doc-details] [data-test-title]")
      .hasText(document.title.en);

    assert.dom("[data-test-title-input]").doesNotExist();

    await click("[data-test-single-doc-details] [data-test-title]");
    assert.dom("[data-test-title-input]").hasValue(document.title.en);

    await fillIn("[data-test-title-input]", "new title");
    this.assertRequest("PATCH", "/api/v1/documents/:id", (request) => {
      assert.equal(
        request.params.id,
        document.id,
        "patching the correct document"
      );
      assert.equal(
        JSON.parse(request.requestBody).data.attributes.title.en,
        "new title",
        "new title is set"
      );
    });
    await click("[data-test-single-doc-details] [data-test-save]");
    assert.dom("[data-test-title-input]").doesNotExist();
  });

  test("document detail delete", async function (assert) {
    const document = this.server.create("document");

    assert.expect(3);

    await visit(`/`);

    await click("[data-test-document-list-item]:first-of-type");

    this.assertRequest("DELETE", "/api/v1/documents/:id", (request) => {
      assert.equal(
        request.params.id,
        document.id,
        "deleting the correct document"
      );
    });
    await click("[data-test-single-doc-details] [data-test-delete]");
    await click("[data-test-delete-confirm]");
    assert.equal(currentURL(), "/", "document is removed from url");
    assert.dom("[data-test-document]").doesNotExist();
  });

  test("upload file", async function (assert) {
    assert.expect(3);
    this.server.create("category");

    await visit("/?category=1");
    setLocale("en");

    assert.dom("[data-test-document]").doesNotExist();
    this.assertRequest("POST", "/api/v1/documents", (request) => {
      const attributes = JSON.parse(request.requestBody).data.attributes;
      assert.equal(
        attributes.title.en,
        "test-file.txt",
        "correct title is set"
      );
    });
    await triggerEvent("[data-test-upload] [data-test-input]", "change", {
      files: [new File(["Ember Rules!"], "test-file.txt")],
    });
    assert.dom("[data-test-document-list-item]").exists({ count: 1 });
  });

  test("replace file", async function (assert) {
    // TODO: Update this test
    assert.expect(4);

    const document = this.server.create("document");
    await visit(`/?document=${document.id}`);

    assert.dom("[data-test-file]").doesNotExist();

    this.assertRequest("POST", "/api/v1/files", (request) => {
      const { attributes } = JSON.parse(request.requestBody).data;
      assert.equal(attributes.name, "test-file.txt");
      assert.equal(attributes.type, "original");
    });
    await triggerEvent("[data-test-replace]", "change", {
      files: [new File(["Ember Rules!"], "test-file.txt")],
    });

    assert.dom("[data-test-file]").exists({ count: 1 });
  });

  test("context menu delete", async function (assert) {
    this.server.createList("document", 5);
    assert.expect(3);

    await visit("/");
    await click("[data-test-toggle-side-panel]");

    assert.dom("[data-test-document]").exists({ count: 5 });
    await click(
      "[data-test-document]:first-child [data-test-context-menu-trigger]"
    );
    this.assertRequest("DELETE", "/api/v1/documents/:id", (request) => {
      assert.equal(request.params.id, 1, "deleting the correct document");
    });
    await click(
      "[data-test-document]:first-child [data-test-context-menu] [data-test-delete]"
    );
    await click("[data-test-delete-confirm]");
    assert.dom("[data-test-document]").exists({ count: 4 });
  });

  test.todo("downloading multiple documents as a zip", async function (assert) {
    this.server.createList("document", 5);
    await visit("/");
    await click("[data-test-toggle-side-panel]");
    await click("[data-test-document]", {
      shiftKey: true,
    });
    await click(
      "[data-test-document-container]:nth-child(3) [data-test-document]",
      {
        shiftKey: true,
      }
    );
    assert.dom("[data-test-zip-download-text]").includesText("3");
    // TODO: Update this test as soon as the backend has been set up
    this.assertRequest("GET", "/api/v1/documents/zip/:ids", (request) => {
      assert.equal(
        request.params.ids,
        [1, 2, 3],
        "requesting the correct documents as a zip"
      );
    });
    await click("[data-test-zip-download-button]");
  });

  test("selecting documents with CTRL A", async function (assert) {
    this.server.createList("document", 3);
    await visit("/");
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "a", ctrlKey: true })
    );
    await triggerEvent(window, "keydown", "a", {
      ctrlKey: true,
    });

    assert
      .dom("[data-test-document-list-item].document-list-item-selected")
      .exists({ count: 3 });
  });

  test("deselecting documents with Escape", async function (assert) {
    this.server.createList("document", 3);
    await visit("/");
    await click("[data-test-document-list-item]:first-child");
    assert
      .dom("[data-test-document-list-item].document-list-item-selected")
      .exists({ count: 1 });

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await triggerEvent(window, "keydown", "Escape");

    assert
      .dom("[data-test-document-list-item].document-list-item-selected")
      .doesNotExist();
  });
});
