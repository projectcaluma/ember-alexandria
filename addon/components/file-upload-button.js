import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class FileUploadButtonComponent extends Component {
  @service notification;

  @action upload() {}
}
