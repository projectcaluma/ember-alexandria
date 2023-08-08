import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
export default class TagManagerComponent extends Component {
  @service("tags") tagService;
  @service config;

  @action
  toggleMark(mark) {
    Promise.all(
      this.documents.map((document) => {
        if (mark.activeOnAll) {
          return this.tagService.remove(document, mark.type);
        }
        return this.tagService.add(document, mark.type);
      }),
    );
  }

  get documents() {
    return this.args.documents.filter((document) => !document.isDeleted);
  }

  get marks() {
    return this.config.marks.map((mark) => {
      const activeDocuments = this.documents.reduce((acc, doc) => {
        return (
          acc + Number(Boolean(doc.tags.find((tag) => tag.name === mark.type)))
        );
      }, 0);

      return {
        ...mark,
        activeOnAll: activeDocuments === this.documents.length,
        activeOnNone: activeDocuments === 0,
      };
    });
  }
}
