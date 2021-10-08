import { action } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import fetch from "fetch";

export default class DocumentsService extends Service {
  @service store;
  @service config;
  @service router;
  @tracked selectedDocuments = [];
  @tracked shortcutsDisabled = false;

  constructor(...args) {
    super(...args);
    // Initialise the selected documents based on the query params of the route
    const documentQueryParam = this.router?.currentRoute?.queryParams?.document;
    if (documentQueryParam) {
      documentQueryParam.split(",").map(async (id) => {
        this.selectDocument(await this.store.find("document", id));
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
    this.router.transitionTo({
      queryParams: {
        document: docs,
      },
    });
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
        (await this.store.peekRecord("category", category)) ||
        this.store.findRecord("category", category);
    }

    await Promise.all(
      Array.from(files).map(async (file) => {
        const documentModel = this.store.createRecord("document", {
          category,
          meta: this.config.defaultModelMeta.document,
          createdByGroup: this.config.activeGroup,
          modifiedByGroup: this.config.activeGroup,
        });
        documentModel.title = file.name;
        await documentModel.save();

        const fileModel = this.store.createRecord("file", {
          name: file.name,
          type: "original",
          document: documentModel,
          createdByGroup: this.config.activeGroup,
          modifiedByGroup: this.config.activeGroup,
        });
        await fileModel.save();

        const response = await fetch(fileModel.uploadUrl, {
          method: "PUT",
          body: file,
        });

        if (!response.ok) {
          throw new Error(response.statusText, response.status);
        }
      })
    );
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
      type: "original",
      document,
      createdByGroup: this.config.activeGroup,
      modifiedByGroup: this.config.activeGroup,
    });

    await fileModel.save();

    const response = await fetch(fileModel.uploadUrl, {
      method: "PUT",
      body: file,
    });

    if (!response.ok) {
      throw new Error(response.statusText, response.status);
    }
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
      (d) => d.id !== doc.id
    );
    this.updateRoute();
  }

  enableShortcuts() {
    this.shortcutsDisabled = false;
  }
  disableShortcuts() {
    this.shortcutsDisabled = true;
  }
}
