import { action } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";
import { saveAs } from "file-saver";
import mime from "mime";

import { ErrorHandler } from "ember-alexandria/utils/error-handler";

/**
 * Check if document upload is in allowed mime types of category
 * If no allowedMimeTypes are set on the category, just return true
 */
const fileHasValidMimeType = (file, category) =>
  category.allowedMimeTypes?.includes(
    file.mimeType || mime.getType(file.name ?? file.title),
  ) ?? true;

export default class AlexandriaDocumentsService extends Service {
  @service store;
  @service("alexandria-config") config;
  @service router;
  @service notification;
  @service intl;
  @service fetch;

  @tracked selectedDocuments = [];
  @tracked shortcutsDisabled = false;

  constructor(...args) {
    super(...args);
    // Initialise the selected documents based on the query params of the route
    const documentQueryParam =
      this.router.externalRouter?.currentRoute?.queryParams?.document;
    if (documentQueryParam) {
      documentQueryParam.split(",").map(async (id) => {
        this.selectDocument(await this.store.findRecord("document", id));
      });
    }
  }

  /**
   * Updates the route depending to reflect the currently selected documents
   */
  updateRoute() {
    const docs =
      this.selectedDocuments.length === 0
        ? undefined
        : this.selectedDocuments.map((d) => d.id);

    this.router.transitionTo(this.router.currentRouteName, {
      queryParams: {
        document: docs,
      },
    });
  }

  /**
   * Throw a error if mime type of document does't match category allowedMimeTypes
   */
  mimeTypeErrorNotification(category) {
    this.notification.danger(
      this.intl.t("alexandria.errors.invalid-file-type", {
        category: category.name,
        types: category.allowedMimeTypes
          .map((t) => mime.getExtension(t))
          .filter(Boolean)
          .join(", "),
      }),
    );
  }

  /**
   * Uploads one or multiple files and creates the necessary document and
   * files entries on the API.
   *
   * @param {Object|String|Number} category Either an ID or category instance.
   * @param {Array<File>} files The file(s) from input[type=file].
   */
  async upload(category, files) {
    if (!category.id) {
      category =
        this.store.peekRecord("category", category) ||
        (await this.store.findRecord("category", category));
    }

    for (const file of files) {
      if (!fileHasValidMimeType(file, category)) {
        this.mimeTypeErrorNotification(category);
        return;
      }
    }

    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => {
          const documentModel = this.store.createRecord("document", {
            category,
            metainfo: this.config.defaultModelMeta.document,
            createdByGroup: this.config.activeGroup,
            modifiedByGroup: this.config.activeGroup,
            content: file,
          });
          // must be set outside for localized model
          documentModel.title = file.name;
          await documentModel.save();
          return documentModel;
        }),
      );

      this.notification.success(
        this.intl.t("alexandria.success.upload-document", {
          count: files.length,
        }),
      );

      return uploaded;
    } catch (error) {
      new ErrorHandler(this, error).notify(
        "alexandria.errors.upload-document",
        {
          count: files.length,
        },
      );
    }
  }

  /**
   * Uploads a new version of a file and creates the necessary API entry.
   *
   * @param {Object} document A document instance.
   * @param {File} file The file from input[type=file].
   */
  async replace(document, file) {
    const fileModel = this.store.createRecord("file", {
      name: file.name,
      variant: "original",
      document,
      createdByGroup: this.config.activeGroup,
      modifiedByGroup: this.config.activeGroup,
      content: file,
    });
    await fileModel.save();
  }

  /**
   * Moves one or multiple files to a new category.
   *
   * @param {Object} newCategory category instance.
   * @param {Array<Number>} documentIds.
   */
  async move(newCategory, documentIds) {
    const INVALID_FILE_TYPE = "invalid-file-type";

    const states = await Promise.all(
      documentIds.map(async (id) => {
        const document = this.store.peekRecord("document", id);

        if (!document || document.category.id === newCategory) {
          return true;
        }

        const files = (await document.files) ?? [];
        if (files.some((file) => !fileHasValidMimeType(file, newCategory))) {
          return "invalid-file-type";
        }

        const previousCategory = this.store.peekRecord(
          "category",
          document.category.id,
        );

        try {
          document.category = newCategory;
          await document.save();
          return true;
        } catch (error) {
          document.category = previousCategory;

          new ErrorHandler(this, error).notify();

          return false;
        }
      }),
    );

    if (states.includes(INVALID_FILE_TYPE)) {
      this.mimeTypeErrorNotification(newCategory);
      return states.map((state) =>
        state === INVALID_FILE_TYPE ? false : state,
      );
    }

    return states;
  }

  /**
   * Clears the document selection
   */
  @action clearDocumentSelection() {
    this.selectedDocuments = [];
    this.updateRoute();
  }

  /**
   * Checks if the document is selected
   *
   * @param {Object} doc an EmberData representation of a Document
   * @returns {Boolean} If the document is selected
   */
  @action documentIsSelected(doc) {
    return !!this.selectedDocuments.find((d) => d.id === doc.id);
  }

  /**
   * Selects the document
   * @param {Object} doc an EmberData representation of a Document
   */
  @action selectDocument(doc) {
    if (!this.selectedDocuments.includes(doc)) {
      this.selectedDocuments = [...this.selectedDocuments, doc];
      this.updateRoute();
    }
  }

  /**
   * Removes a document from the document selection
   * @param {Object} doc an EmberData representation of a Document
   */
  @action deselectDocument(doc) {
    this.selectedDocuments = this.selectedDocuments.filter(
      (d) => d.id !== doc.id,
    );
    this.updateRoute();
  }

  enableShortcuts() {
    this.shortcutsDisabled = false;
  }
  disableShortcuts() {
    this.shortcutsDisabled = true;
  }

  download = task({ drop: true }, async (documents) => {
    try {
      if (documents.length === 1) {
        const doc = documents[0];
        await doc.reload(); // always reload the document to get the latest file (webdav)
        await doc.latestFile.promise;
        const file = doc.latestFile.value;
        return await file.download.perform();
      }

      // If we want to save a zip of files we need to do some more stuff
      // Compile an array of original file PKs
      const originalFilePKs = encodeURIComponent(
        documents.map((doc) => doc.latestFile.value.id).join(","),
      );

      let url = this.config?.zipDownloadHost || ""; // in case we need to send the zipDownload to another URL
      url += this.config?.zipDownloadNamespace || ""; // in case we need to namespace the alexandria api
      url += "/api/v1/files/multi";
      url += `?filter[files]=${originalFilePKs}`; // list of files we want to download

      // Some alexandria applications require the document-meta as well
      if (this.config.modelMetaFilters.document) {
        url += `&filter[document-metainfo]=${encodeURIComponent(
          JSON.stringify(this.config.modelMetaFilters.document),
        )}`;
      }

      const transfer = await this.fetch.fetch(url, { mode: "cors" });
      const bytes = await transfer.blob();
      saveAs(bytes, `Download-${documents.length}-files.zip`);
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.save-file");
    }
  });
}
