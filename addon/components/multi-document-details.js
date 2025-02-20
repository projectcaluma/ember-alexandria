import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { task } from "ember-concurrency";

import { ErrorHandler } from "ember-alexandria/utils/error-handler";

export default class MultiDocumentDetailsComponent extends Component {
  @service("alexandria-side-panel") sidePanel;
  @service("alexandria-documents") documents;
  @service notification;
  @service intl;

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

  copyDocuments = task({ drop: true }, async (event) => {
    event?.preventDefault();
    try {
      await this.documents.copy(
        this.args.selectedDocuments.map((doc) => doc.id),
      );
      await this.args.refreshDocumentList();
      this.notification.success(
        this.intl.t("alexandria.success.copy-document", {
          count: this.args.selectedDocuments.length,
        }),
      );
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.copy-document", {
        count: this.args.selectedDocuments.length,
      });
    }
  });
}
