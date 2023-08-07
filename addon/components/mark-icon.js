import Component from "@glimmer/component";
import { isHTMLSafe } from "@ember/template";

export default class MarkIcon extends Component {
  get hasHTML() {
    return isHTMLSafe(this.args.mark.icon);
  }
}
