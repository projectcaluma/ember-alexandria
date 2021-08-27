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
    if (this.args.document || this.args?.documents.length === 1) {
      const doc = this.args.document || this.args?.documents[0];
      try {
        const file = doc.files.find((file) => file.type === "original");
        const extension = file.name.includes(".")
          ? `.${file.name.split(".").slice(-1)[0]}`
          : "";

        // There is a known issue with file-saver and urls.
        // The filename passed as the second argument is ignored.
        // https://github.com/eligrey/FileSaver.js/issues/670
        yield saveAs(file.downloadUrl, doc.title + extension);
      } catch (error) {
        this.notification.danger(this.intl.t("alexandria.errors.save-file"));
      }
    } else {
      // Compile an array of original file PKs
      const originalFilePKs = encodeURIComponent(
        this.args.documents
          .map((doc) =>
            doc.files.toArray().find((file) => file.type === "original")
          )
          .map((f) => f.id)
          .join(",")
      );

      const url = `/api/v1/files/multi?filter%5Bfiles%5D=${originalFilePKs}`;
      yield saveAs(url, `Download-${this.args.documents.length}-files.zip`);
    }
  }
}
