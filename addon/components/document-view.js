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
  @tracked dragAction = "upload";
  @tracked dragCounter = 0;
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
    return Boolean(
      ["copy", "upload"].includes(this.dragAction) &&
        this.args.filters &&
        this.args.filters.categories,
    );
  }

  get dropAllowed() {
    return ["copy", "upload"].includes(this.dragAction);
  }

  @action toggleView() {
    this.router.transitionTo(this.router.currentRouteName, {
      queryParams: { listView: !this.args.listView },
    });
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
    let documents = [];
    const filter = this.args.filters || {};
    if (filter.query) {
      filter.onlyNewest = true;
      filter.documentMetainfo = filter.metainfo;
      delete filter.metainfo;
      const searchResult = yield this.store.query(
        "search-result",
        {
          include: "document,matched_file",
          filter,
          page: { number: 1 },
        },
        {
          adapterOptions: {
            customEndpoint: "search",
          },
        },
      );

      documents = searchResult.reduce((acc, result) => {
        if (!acc.some((doc) => doc.id === result.document.id)) {
          acc.push(result.document);
        }
        return acc;
      }, []);
    } else {
      documents = yield this.store.query("document", {
        include: "category,files,tags",
        filter,
        sort: this.sort ? `${this.sortDirection}${this.sort}` : "",
      });
    }

    this.initialiseDocumentSelection(documents);

    return yield this.config.documentsPostProcess(documents);
  }

  initialiseDocumentSelection(docs) {
    let docIds = [];
    if (this.router.externalRouter.currentRoute?.queryParams?.document) {
      docIds = decodeURIComponent(
        this.router.externalRouter.currentRoute.queryParams.document,
      ).split(",");
    }
    if (docIds.length !== 0) {
      const selectedDocs = [...docs].filter((doc) => docIds.includes(doc.id));
      selectedDocs.forEach((doc) => this.documents.selectDocument(doc));
    }
  }

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
    this.dragAction = event.ctrlKey ? "copy" : "move";
    if (
      this.dragAction === "move" &&
      (!this.args.filters.categories || !event.dataTransfer.files?.length)
    ) {
      this.dragCounter = 0;
      this.isDragOver = false;
      this.dragAction = "upload";
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    // Copy documents to current category when dropped in document view.
    this.dragCounter = 0;
    this.isDragOver = false;

    if ("copy" === this.dragAction) {
      const documentIds = event.dataTransfer.getData("text").split(",");
      const category = this.args.filters.categories;
      if (!documentIds.length || !category) {
        this.dragCounter = 0;
        this.isDragOver = false;
        this.dragAction = "upload";
        return;
      }

      await this.documents.copy(documentIds, category);
    } else {
      // upload new files if it is a file(s) drop.
      await this.documents.upload(
        this.args.filters.categories,
        event.dataTransfer.files,
      );
    }

    this.refreshDocumentList();
    this.dragAction = "upload";
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
      this.dragCounter = 0;
      this.isDragOver = false;
      this.dragAction = "upload";
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
    this.dragAction = event.ctrlKey ? "copy" : "move";
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

  get tableColumns() {
    return {
      type: {
        label: "type",
        labelHidden: true,
      },
      title: {
        label: "document-title",
        sort: true,
      },
      marks: {
        label: "marks",
        labelHidden: true,
      },
      date: {
        label: "date",
        sort: true,
      },
      modifiedAt: {
        label: "modified-at",
        sort: true,
      },
      createdByUser: {
        label: "created-by-user",
        sort: true,
      },
      createdByGroup: {
        label: "created-by-group",
        sort: true,
      },
    };
  }

  get dragInfoTranslationKey() {
    if (this.dragAction === "upload") {
      return false;
    }

    return `alexandria.${this.dragAction}-document`;
  }
}
