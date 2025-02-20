import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class MultiDocumentDetailsComponent extends Component {
  @service("alexandria-side-panel") sidePanel;
  @service("alexandria-documents") documents;
  @tracked deleteDialog = null;

  constructor(parent, args) {
    super(parent, args);

    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener("keydown", this.boundHandleKeyDown);
  }

  @action
  registerDeleteDialog(showDialog) {
    this.deleteDialog = showDialog;
  }

  willDestroy() {
    super.willDestroy();
    window.removeEventListener("keydown", this.boundHandleKeyDown);
  }

  handleKeyDown(event) {
    if (this.documents.shortcutsDisabled) {
      return;
    }

    if (event.key === "Delete" && this.deleteDialog) {
      this.deleteDialog();
    }
  }

  get mergedTags() {
    const tags = [];
    const nrOfDocs = this.args.selectedDocuments.length;
    const allTags = this.args.selectedDocuments
      .map((d) => d.tags) // all the tags for a document
      .flat()
      .map((t) => t.name); // produces one large array of all tags

    this.args.selectedDocuments.forEach((doc) => {
      doc.tags.forEach((tag) => {
        tags.push({
          name: tag.name,
          selectedByAll:
            allTags.filter((t) => t.name === tag.name) === nrOfDocs,
        });
      });
    });

    return tags;
  }
}
