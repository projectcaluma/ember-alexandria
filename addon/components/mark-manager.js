import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
export default class TagManagerComponent extends Component {
  @service("tags") tagService;
  @service config;

  @action
  toggleMark(mark) {
    if (mark.active) {
      this.tagService.remove(this.args.document, mark.type);
    } else {
      this.tagService.add(this.args.document, mark.type);
    }
  }

  get marks() {
    return this.config.marks.map((mark) => {
      const activeOnAll = this.args.documents.marks.every((m) => m.active);
      const activeOnNone = this.args.documents.marks.every((m) => !m.active);

      return {
        ...mark,
        activeOnAll,
        activeOnNone,
      };
    });
  }
}
