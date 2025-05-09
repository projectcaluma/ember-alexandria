import { service } from "@ember/service";
import Component from "@glimmer/component";
export default class MarkManagerComponent extends Component {
  @service("alexandria-marks") marks;

  get documents() {
    return this.args.documents.filter((document) => !document.isDeleted);
  }
}
