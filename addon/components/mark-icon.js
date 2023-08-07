import { isHTMLSafe } from "@ember/template";
import Component from "@glimmer/component";

export default class MarkIcon extends Component {
  get hasHTML() {
    return isHTMLSafe(this.args.mark.icon);
  }
}
