import { action } from "@ember/object";
// import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
// import { tracked } from "@glimmer/tracking";
// import { lastValue, task } from "ember-concurrency-decorators";

export default class MultipleDocumentsDetails extends Component {
  // @service notification;
  // @service config;
  // @service store;
  // @service intl;
  // @service documents;
  // @service router;

  // @tracked isDragOver = false;
  // @tracked dragCounter = 0;
  // @tracked listView = true;
  // @tracked sort = "";
  // @tracked sortDirection = "";

  get mergedTags() {
    const tags = [];
    const nrOfDocs = this.args.documents.length;
    const allTags = this.args.documents
      .map((d) => d.tags.toArray()) // all the tags for a document
      .flat()
      .map((t) => t.name); // produces one large array of all tags

    this.args.documents.forEach((doc) => {
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

  @action closePanel() {
    this.router.transitionTo({ queryParams: { document: undefined } });
  }
}
