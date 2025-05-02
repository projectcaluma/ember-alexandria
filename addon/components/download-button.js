import { service } from "@ember/service";
import Component from "@glimmer/component";

export default class DownloadButtonComponent extends Component {
  @service("alexandria-documents") documents;
}
