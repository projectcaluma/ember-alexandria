import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class FileUploadButtonComponent extends Component {
  @service notification;

  @action upload() {}
}
