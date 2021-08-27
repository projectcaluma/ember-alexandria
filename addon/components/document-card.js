import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { task } from "ember-concurrency-decorators";
import { saveAs } from "file-saver";

export default class DocumentCardComponent extends Component {
  @service notification;
  @service intl;

  get showLoadingState() {
    return this.download.isRunning || this.delete.isRunning;
  }

  @task *download() {
    if (this.args.document) {
      // TODO: Currently this only works for a single document
      try {
        const file = this.args.document.files.find(
          (file) => file.type === "original"
        );
        const extension = file.name.includes(".")
          ? `.${file.name.split(".").slice(-1)[0]}`
          : "";

        // There is a known issue with file-saver and urls.
        // The filename passed as the second argument is ignored.
        // https://github.com/eligrey/FileSaver.js/issues/670
        yield saveAs(file.downloadUrl, this.args.document.title + extension);
      } catch (error) {
        this.notification.danger(this.intl.t("alexandria.errors.save-file"));
      }
    }
  }
}
