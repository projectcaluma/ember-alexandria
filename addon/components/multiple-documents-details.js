import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
// import { lastValue, task } from "ember-concurrency-decorators";

export default class MultipleDocumentsDetails extends Component {
  @service sidePanel;

  get open() {
    return this.sidePanel.open;
  }

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
    console.log("🦠 this.sidePanel:", this.sidePanel);
    this.sidePanel.toggle();
  }
}
