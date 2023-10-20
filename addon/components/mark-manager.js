import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
export default class TagManagerComponent extends Component {
  @service config;

  get documents() {
    return this.args.documents.filter((document) => !document.isDeleted);
  }
}
