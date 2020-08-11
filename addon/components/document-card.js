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
    try {
      // There is a known issue with file-saver and urls. The filename passed as the second argument is ignored.
      // https://github.com/eligrey/FileSaver.js/issues/670
      yield saveAs(
        this.args.document.files.filter((file) => file.type === "original")[0]
          .downloadUrl,
        this.args.document.title
      );
    } catch (error) {
      this.notification.danger(this.intl.t("alexandria.errors.save-file"));
    }
  }

  @task *delete() {
    try {
      yield this.args.document.destroyRecord();
      this.notification.success(
        this.intl.t("alexandria.success.delete-document")
      );
    } catch (error) {
      this.notification.danger(
        this.intl.t("alexandria.errors.delete-document")
      );
    }
  }
}
