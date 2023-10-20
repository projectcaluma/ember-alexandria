import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class MarkManagerMarkComponent extends Component {
  @service("tags") tagService;

  get activeDocumentCount() {
    return this.args.documents.reduce((acc, doc) => {
      return (
        acc +
        Number(
          Boolean(doc.tags.find((tag) => tag.name === this.args.mark.type)),
        )
      );
    }, 0);
  }

  get checked() {
    return this.activeDocumentCount === this.args.documents.length;
  }

  get class() {
    return this.checked
      ? "mark--active"
      : this.activeDocumentCount > 0
      ? "mark--mixed"
      : "";
  }

  @action
  toggle() {
    return Promise.all(
      this.args.documents.map((document) => {
        if (this.checked) {
          return this.tagService.remove(document, this.args.mark.type);
        }
        return this.tagService.add(document, this.args.mark.type);
      }),
    );
  }
}
