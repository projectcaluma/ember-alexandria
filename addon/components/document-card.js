import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { task } from "ember-concurrency";
import { saveAs } from "file-saver";

export default class DocumentCardComponent extends Component {
  @service notification;
  @service intl;
  @service config;

  get showLoadingState() {
    return this.download.isRunning || this.delete.isRunning;
  }

  @task *download() {
    if (this.args.document || this.args?.documents.length === 1) {
      // If we download a single file we can use the saveAs library
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
      } catch {
        this.notification.danger(this.intl.t("alexandria.errors.save-file"));
      }
    } else {
      // If we want to save a zip of files we need to do some more stuff
      // Compile an array of original file PKs
      const originalFilePKs = encodeURIComponent(
        this.args.documents
          .map((doc) =>
            doc.files.toArray().find((file) => file.type === "original")
          )
          .map((f) => f.id)
          .join(",")
      );

      let url = this.config?.zipDownloadHost || ""; // in case we need to send the zipDownload to another URL
      url += this.config?.zipDownloadNamespace || ""; // in case we need to namespace the alexandria api
      url += "/api/v1/files/multi";
      url += `?filter[files]=${originalFilePKs}`; // list of files we want to download

      // Some alexandria applications require the document-meta as well
      if (this.config.modelMetaFilters.document)
        url += `&filter[document-meta]=${encodeURIComponent(
          JSON.stringify(this.config.modelMetaFilters.document)
        )}`;

      const transfer = yield fetch(url, {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
        },
      });
      const bytes = yield transfer.blob();
      saveAs(bytes, `Download-${this.args.documents.length}-files.zip`);
    }
  }
}
