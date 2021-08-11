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
    // TODO: The sort attribute should also be reflected in the URL!
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

  // TODO: Enable fetching of documents based on query param
  // @action fetchDocumentsFromUrl() {
  //   if (this.router.currentRoute.queryParams.document) {
  //     this.selectDocumentsByIds(
  //       decodeURIComponent(this.router.currentRoute.queryParams.document).split(
  //         ","
  //       )
  //     );
  //   }
  // }

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
      this.router.transitionTo({
        queryParams: { document: selectedDocument.id },
      });
      return;
    }
    if (event.ctrlKey) {
      if (this.documentIsSelected(selectedDocument)) {
        this.deselectDocument(selectedDocument);
      } else {
        this.selectDocument(selectedDocument);
      }
      return;
    }
    if (event.shiftKey) {
      const selectedDocIndex = this.fetchedDocuments.indexOf(selectedDocument);
      const lastSelectedDocIndex = this.fetchedDocuments.indexOf(
        this.selectedDocuments[0]
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

      this.selectedDocuments = [];
      for (let i = startIndex; i <= endIndex; i++) {
        this.selectedDocuments.push(this.fetchedDocuments.toArray()[i]);
      }
    }

    this.router.transitionTo({
      queryParams: {
        document: this.selectedDocuments.map((d) => d.id),
      },
    });
  }

  @action documentIsSelected(doc) {
    return !!this.selectedDocuments.find((d) => d.id === doc.id);
  }

  @action clearDocumentSelection() {
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

  // TODO: Enable automatic selection based on URL
  // @action selectDocumentsByIds(documentIds) {
  //   documentIds.forEach((id) => {
  //     const selectedDoc = this.fetchedDocuments.findBy("id", id.toString());
  //     this.selectDocument(selectedDoc);
  //   });
  // }
}
