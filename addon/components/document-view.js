import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { lastValue, task } from "ember-concurrency-decorators";

export default class DocumentViewComponent extends Component {
  @service notification;
  @service config;
  @service store;
  @service intl;
  @service documents;

  @tracked isDragOver = false;
  @tracked dragCounter = 0;
  @tracked listView = true;
  @tracked sort = "";
  @tracked sortDirection = "";

  // DOCUMENT SELECTION
  @tracked selectedDocuments = [];

  get canDrop() {
    return Boolean(this.args.filters && this.args.filters.category);
  }

  get selectedDocument() {
    if (this.args.selectedDocumentId) {
      return (
        this.fetchedDocuments &&
        this.store.peekRecord("document", this.args.selectedDocumentId)
      );
    }
    return undefined;
  }

  @action toggleView() {
    this.listView = !this.listView;
  }

  @action setSort(sortAttribute) {
    if (this.sort === sortAttribute) {
      this.sortDirection = this.sortDirection === "" ? "-" : "";
    } else {
      this.sort = sortAttribute;
      this.sortDirection = "";
    }
    this.fetchDocuments.perform();
  }

  @lastValue("fetchDocuments") fetchedDocuments;
  @task
  *fetchDocuments() {
    return yield this.store.query("document", {
      include: "category,files,tags",
      filter: this.args.filters || {},
      sort: this.sort ? `${this.sortDirection}${this.sort}` : "",
    });
  }

  // Drag'n'Drop document upload

  @action onDragEnter() {
    this.dragCounter++;
    this.isDragOver = true;
  }

  @action onDragLeave() {
    this.dragCounter--;
    this.isDragOver = this.dragCounter > 0;
  }

  @action onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  @action async onDrop(event) {
    if (!this.args.filters.category) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const { files } = event.dataTransfer;

    try {
      await this.documents.upload(this.args.filters.category, files);

      this.notification.success(
        this.intl.t("alexandria.success.upload-document", {
          count: files.length,
        })
      );

      await this.fetchDocuments.perform();
    } catch (error) {
      this.notification.danger(
        this.intl.t("alexandria.errors.upload-document", {
          count: files.length,
        })
      );
    }

    this.isDragOver = false;
  }

  // * DOCUMENT SELECTION
  @action handleDocumentSelection(selectedDocument, event) {
    if (!event.ctrlKey && !event.shiftKey) {
      this.clearDocumentSelection();
      this.selectDocument(selectedDocument);
      return;
    }
    if (event.ctrlKey) {
      if (this.documentIsSelected(selectedDocument)) {
        this.deselectDocument(selectedDocument);
      } else {
        this.selectDocument(selectedDocument);
      }
    }

    if (this.selectedDocuments.length === 0) {
      // we haven't selected any documents yet
      console.log("🔫", "in here");
      console.log("🦠 selectedDocument:", selectedDocument);
      this.selectDocument(selectedDocument);
    }

    console.log("🦠 this.selectedDocuments:", this.selectedDocuments);

    // // the document is already selected
    // if (this.selectedDocuments.find((d) => d.id === selectedDocument.id)) {
    //   this.deselectDocument(selectedDocument);
    // } else {
    //   this.selectedDocuments.push(selectedDocument);
    // }
  }

  @action documentIsSelected(doc) {
    return !!this.selectedDocuments.find((d) => d.id === doc.id);
  }

  clearDocumentSelection() {
    this.selectedDocuments = [];
  }

  @action selectDocument(doc) {
    this.selectedDocuments = [...this.selectedDocuments, doc];
  }

  @action deselectDocument(selectedDocument) {
    this.selectedDocuments = this.selectedDocuments.filter(
      (d) => d.id !== selectedDocument.id
    );
  }

  @action shiftSelect(selectedDocument) {
    return selectedDocument;
  }

  @action ctrlSelect(selectedDocument) {
    return selectedDocument;
  }
}
