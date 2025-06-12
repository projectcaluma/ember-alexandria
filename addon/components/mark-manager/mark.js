import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";

export default class MarkManagerMarkComponent extends Component {
  @service("alexandria-marks") marks;

  get activeDocumentCount() {
    return this.args.documents.reduce((acc, doc) => {
      return (
        acc +
        Number(Boolean(doc.marks.find((mark) => mark.id === this.args.mark.id)))
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
          return this.marks.remove(document, this.args.mark);
        }
        return this.marks.add(document, this.args.mark);
      }),
    );
  }
}
