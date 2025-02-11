import { render, click, fillIn, waitFor } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setFlatpickrDate } from "ember-flatpickr/test-support/helpers";
import { module, test } from "qunit";
import { fake, stub } from "sinon";

module("Integration | Component | single-document-details", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders document information", async function (assert) {
    const file = {
      variant: "original",
      name: "some-file.pdf",
      createdByUser: null,
      downloadUrl: "http://test.com",
      download: { perform: fake() },
      fileTypeInfo: {
        label: "PDF",
        icon: "file-pdf",
      },
    };

    this.selectedDocument = {
      title: "Test",
      category: { color: "#F00" },
      createdAt: new Date(1998, 11, 11),
      createdByUser: "user1",
      createdByGroup: "group1",
      latestFile: { value: file },
      files: [file],
    };

    await render(
      hbs`<SingleDocumentDetails @document={{this.selectedDocument}} />`,
      { owner: this.engine },
    );

    assert.dom("[data-test-single-doc-details]").doesNotHaveClass("closed");
    assert.dom("[data-test-title-icon]").hasStyle({ color: "rgb(255, 0, 0)" });

    assert.dom("[data-test-title]").hasText(this.selectedDocument.title);
    assert.dom("[data-test-file-type]").hasText("PDF");
    assert.dom("[data-test-file-type] svg[data-icon='file-pdf']").exists();
    assert.dom("[data-test-created-at]").hasText("12/11/1998, 12:00 AM");
    assert
      .dom("[data-test-created-by-user]")
      .hasText(this.selectedDocument.createdByUser.toUpperCase());
    assert
      .dom("[data-test-created-by-group]")
      .hasText(this.selectedDocument.createdByGroup);

    assert.dom("[data-test-close]").exists();
    assert.dom("[data-test-delete]").exists();
    assert.dom("[data-test-file-download-link]").exists();
  });

  test("delete document", async function (assert) {
    const router = this.engine.lookup("service:router");

    stub(router, "currentRouteName").get(() => null);
    router.transitionTo = fake();

    const destroy = fake();
    this.selectedDocument = {
      id: 1,
      title: "Test",
      destroyRecord: async () => destroy(),
    };

    await render(
      hbs`<SingleDocumentDetails @document={{this.selectedDocument}}/>`,
      { owner: this.engine },
    );

    await click("[data-test-delete]");
    await click("[data-test-delete-confirm]");

    assert.ok(destroy.calledOnce, "destroyRecord was called once");
    assert.ok(router.transitionTo.calledOnce, "transitionTo was called once");
  });

  test("edit document title", async function (assert) {
    // To prevent:
    // Error: Assertion Failed: You attempted to update [object Object].title to "edited", but it is being tracked by a tracking context, such as a template, computed property, or observer. In order to make sure the context updates properly, you must invalidate the property when updating it. You can mark the property as `@tracked`, or use `@ember/object#set` to do this.
    class Document {
      @tracked title = "unedited";
      save = fake();
    }
    this.selectedDocument = new Document();
    await render(
      hbs`<SingleDocumentDetails @document={{this.selectedDocument}}/>`,
      { owner: this.engine },
    );

    assert.dom("[data-test-title]").exists();
    assert.dom("[data-test-title-input]").doesNotExist();

    await click("[data-test-edit-title]");

    assert.dom("[data-test-title]").doesNotExist();
    assert.dom("[data-test-title-input]").exists();

    assert.dom("[data-test-title-input]").hasValue("unedited");

    await fillIn("[data-test-title-input]", "");
    assert.dom("[data-test-title-input]").hasValue("");
    assert.dom("[data-test-save]").isDisabled();

    await fillIn("[data-test-title-input]", "edited");
    assert.dom("[data-test-title-input]").hasValue("edited");

    await click("[data-test-save]");

    assert.dom("[data-test-title]").exists();
    assert.dom("[data-test-title-input]").doesNotExist();

    assert.ok(this.selectedDocument.save.calledOnce, "save was called once");
  });

  test("edit document date", async function (assert) {
    class Document {
      @tracked date = "2023-01-01";
      save = fake();
    }
    this.selectedDocument = new Document();

    await render(
      hbs`<SingleDocumentDetails @document={{this.selectedDocument}}/>`,
      { owner: this.engine },
    );

    assert.dom("[data-test-date]").exists();
    assert.dom("[data-test-date-input]").doesNotExist();

    assert.dom("[data-test-date]").hasText("01/01/2023");

    await click("[data-test-edit-date]");

    assert.dom("[data-test-date]").doesNotExist();
    assert.dom("[data-test-date-input]").exists();

    await setFlatpickrDate("[data-test-date-input]", new Date("2023-10-31"));
    await waitFor("[data-test-date]");

    assert.dom("[data-test-date]").exists();
    assert.dom("[data-test-date-input]").doesNotExist();

    assert.dom("[data-test-date]").hasText("10/31/2023");
  });

  test("it renders conversion", async function (assert) {
    this.selectedDocument = {
      latestFile: { value: { mimeType: "application/pdf" } },
    };

    await render(
      hbs`<SingleDocumentDetails @document={{this.selectedDocument}} />`,
      { owner: this.engine },
    );

    assert.dom("[data-test-convert-button]").doesNotExist();

    this.selectedDocument = {
      latestFile: {
        value: { mimeType: "application/vnd.oasis.opendocument.text" },
      },
    };

    await render(
      hbs`<SingleDocumentDetails @document={{this.selectedDocument}} />`,
      { owner: this.engine },
    );

    assert.dom("[data-test-convert-button]").exists();
  });

  test("it renders WebDAV button", async function (assert) {
    this.selectedDocument = {
      latestFile: { value: { mimeType: "application/pdf" } },
    };

    await render(
      hbs`<SingleDocumentDetails @document={{this.selectedDocument}} />`,
      { owner: this.engine },
    );

    assert.dom("[data-test-web-dav-button]").doesNotExist();

    this.selectedDocument = {
      latestFile: {
        value: {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      },
    };

    await render(
      hbs`<SingleDocumentDetails @document={{this.selectedDocument}} />`,
      { owner: this.engine },
    );

    assert.dom("[data-test-web-dav-button]").exists();
  });
});
