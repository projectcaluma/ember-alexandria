import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
export default class TagManagerComponent extends Component {
  @service("tags") tagService;
  @service config;

  @action
  toggleMark(mark) {
    Promise.all(
      this.args.documents.map((document) => {
        if (mark.activeOnAll) {
          return this.tagService.remove(document, mark.type);
        }
        return this.tagService.add(document, mark.type);
      }),
    );
  }

  get marks() {
    return this.config.marks.map((mark) => {
      const activeDocuments = this.args.documents.reduce((acc, doc) => {
        return (
          acc + Number(Boolean(doc.tags.find((tag) => tag.name === mark.type)))
        );
      }, 0);

      return {
        ...mark,
        activeOnAll: activeDocuments === this.args.documents.length,
        activeOnNone: activeDocuments === 0,
      };
    });
  }
}
