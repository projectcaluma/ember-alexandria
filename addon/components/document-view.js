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
  @service router;

  @tracked isDragOver = false;
  @tracked dragCounter = 0;
  @tracked listView = true;
  @tracked sort = "title";
  @tracked sortDirection = "";

  get canDrop() {
    return Boolean(this.args.filters && this.args.filters.category);
  }

  // ! DEPRECATED
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
    this.router.transitionTo({
      queryParams: { sort: this.sort, sortDirection: this.sortDirection },
    });
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

  @task
  *initialiseDocumentSelection() {
    /* TODO: This is a very brute force way of doing it
      since i dont know how i could get a collection of EmberData objects otherwise?
      The problem with this is, that we fetch all the documents two times!
    */
    const docIds = decodeURIComponent(
      this.router.currentRoute.queryParams.document
    ).split(",");
    // TODO only do this if array is not empty
    const docs = yield this.store.query("document", {
      filter: this.args.filters || {},
      sort: this.sort ? `${this.sortDirection}${this.sort}` : "",
    });
    const selectedDocs = docs.filter((doc) => docIds.includes(doc.id));
    selectedDocs.forEach((doc) => this.documents.selectDocument(doc));
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
      this.documents.clearDocumentSelection();
      this.documents.selectDocument(selectedDocument);
      this.router.transitionTo({
        queryParams: { document: selectedDocument.id },
      });
      return;
    }
    if (event.ctrlKey) {
      if (this.documents.documentIsSelected(selectedDocument)) {
        this.documents.deselectDocument(selectedDocument);
      } else {
        this.documents.selectDocument(selectedDocument);
      }
      return;
    }
    if (event.shiftKey) {
      const isNoDocSelected = this.documents.selectedDocuments.length === 0;
      if (isNoDocSelected) {
        // If we don't have a document selected yet so simply select the clicked document
        this.documents.selectDocument(selectedDocument);
        this.router.transitionTo({
          queryParams: { document: selectedDocument.id },
        });
        return;
      }

      const selectedDocIndex = this.fetchedDocuments.indexOf(selectedDocument);
      const lastSelectedDocIndex = this.fetchedDocuments.indexOf(
        this.documents.selectedDocuments[0]
      );

      let startIndex, endIndex;
      if (selectedDocIndex > lastSelectedDocIndex) {
        // If we are clicking a document later then the previously selected document (we are going down)
        startIndex = lastSelectedDocIndex;
        endIndex = selectedDocIndex;
      } else {
        // If we are clicking a document earlier than the previously selected document (we are going up)
        startIndex = selectedDocIndex;
        endIndex = lastSelectedDocIndex;
      }

      this.documents.clearDocumentSelection();
      for (let i = startIndex; i <= endIndex; i++) {
        this.documents.selectDocument(this.fetchedDocuments.toArray()[i]);
      }
    }

    this.router.transitionTo({
      queryParams: {
        document: this.documents.selectedDocuments.map((d) => d.id),
      },
    });
  }
}
