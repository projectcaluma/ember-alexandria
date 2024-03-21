import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";
import { task as trackedTask } from "reactiveweb/ember-concurrency";

export default class DocumentViewComponent extends Component {
  @service notification;
  @service store;
  @service intl;
  @service("alexandria-documents") documents;
  @service router;
  @service("alexandria-config") config;

  @tracked isDragOver = false;
  @tracked dragCounter = 0;
  @tracked listView = true;
  @tracked sort = "title";
  @tracked sortDirection = "";
  // Needed for ember-resource
  @tracked uploadedDocuments = 0;

  dragElement = null;

  constructor(parent, args) {
    super(parent, args);
    /* Adds a key down event listener to enable Ctrl+A document selection of all docs
    as well as ESC key press for deselection of all docs */
    window.addEventListener("keydown", (event) => {
      this.handleKeyDown(event);
    });
  }

  get canDrop() {
    return Boolean(this.args.filters && this.args.filters.category);
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
    this.router.transitionTo(this.router.currentRouteName, {
      queryParams: { sort: this.sortDirection + this.sort },
    });
  }

  fetchedDocuments = trackedTask(this, this.fetchDocuments, () => [
    this.sort,
    this.sortDirection,
    this.args.filters,
    this.uploadedDocuments,
  ]);

  @task
  *fetchDocuments() {
    const documents = yield this.store.query("document", {
      include: "category,files,tags",
      filter: this.args.filters || {},
      sort: this.sort ? `${this.sortDirection}${this.sort}` : "",
    });

    return yield this.config.documentsPostProcess(documents);
  }

  @task
  *initialiseDocumentSelection() {
    let docIds = [];
    if (this.router.externalRouter.currentRoute?.queryParams?.document) {
      docIds = decodeURIComponent(
        this.router.externalRouter.currentRoute.queryParams.document,
      ).split(",");
    }
    if (docIds.length !== 0) {
      const docs = yield this.store.query("document", {
        filter: this.args.filters || {},
        sort: this.sort ? `${this.sortDirection}${this.sort}` : "",
      });
      const selectedDocs = [...docs].filter((doc) => docIds.includes(doc.id));
      selectedDocs.forEach((doc) => this.documents.selectDocument(doc));
    }
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

  onDrop = task({ drop: true }, async (event) => {
    if (!this.args.filters.category || !event.dataTransfer.files.length) {
      this.dragCounter = 0;
      this.isDragOver = false;
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    await this.documents.upload(
      this.args.filters.category,
      event.dataTransfer.files,
    );
    this.refreshDocumentList();

    this.dragCounter = 0;
    this.isDragOver = false;
  });

  // * DOCUMENT SELECTION
  handleKeyDown(event) {
    if (this.documents.shortcutsDisabled) {
      return;
    }
    if (event.key === "a" && event.ctrlKey) {
      event.preventDefault();
      this.fetchedDocuments.value.forEach((doc) => {
        this.documents.selectDocument(doc);
      });
    }
    if (event.key === "Escape") {
      this.documents.clearDocumentSelection();
    }
  }

  @action handleDocumentSelection(selectedDocument, event) {
    const isNoDocSelected = this.documents.selectedDocuments.length === 0;
    // SIMPLE CLICK WITH NO MODIFIER KEYS
    if (
      (!event.ctrlKey && !event.shiftKey) ||
      (event.shiftKey && isNoDocSelected)
    ) {
      this.documents.clearDocumentSelection();
      this.documents.selectDocument(selectedDocument);
    }

    // CTRL SELECTION
    if (event.ctrlKey) {
      if (this.documents.documentIsSelected(selectedDocument)) {
        this.documents.deselectDocument(selectedDocument);
      } else {
        this.documents.selectDocument(selectedDocument);
      }
    }

    // SHIFT SELECTION
    if (event.shiftKey) {
      const selectedDocIndex =
        this.fetchedDocuments.value.indexOf(selectedDocument);
      const firstSelectedDocIndex = this.fetchedDocuments.value.indexOf(
        this.documents.selectedDocuments[0],
      );

      let startIndex;
      let endIndex;
      if (selectedDocIndex > firstSelectedDocIndex) {
        // If we are clicking a document later then the previously selected document (we are going down)
        startIndex = firstSelectedDocIndex;
        endIndex = selectedDocIndex;
      } else {
        // If we are clicking a document earlier than the previously selected document (we are going up)
        startIndex = selectedDocIndex;
        endIndex = firstSelectedDocIndex;
      }

      this.documents.clearDocumentSelection();
      for (let i = startIndex; i <= endIndex; i++) {
        this.documents.selectDocument(this.fetchedDocuments.value[i]);
      }
    }
  }

  openDocument = task(async (selectedDocument, event) => {
    event.preventDefault();

    await this.documents.download.perform([selectedDocument]);
  });

  @action
  refreshDocumentList() {
    this.uploadedDocuments++;
  }

  @action registerDragInfo(element) {
    this.dragInfo = element;
  }

  @action dragDocument(document, event) {
    if (!this.documents.selectedDocuments.includes(document)) {
      this.handleDocumentSelection(document, event);
    }

    event.dataTransfer.clearData();
    event.dataTransfer.setData(
      "text/plain",
      this.documents.selectedDocuments.map((d) => d.id).join(","),
    );
    event.dataTransfer.setDragImage(this.dragInfo, -20, 0);
  }
}
