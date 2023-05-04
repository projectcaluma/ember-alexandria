import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
export default class MultiDocumentDetailsComponent extends Component {
  @service sidePanel;

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
