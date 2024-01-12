import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { task } from "ember-concurrency";
import { saveAs } from "file-saver";

import { ErrorHandler } from "ember-alexandria/helpers/error-handler";

export default class DocumentCardComponent extends Component {
  @service notification;
  @service intl;
  @service("alexandria-config") config;
  @service fetch;

  get classes() {
    const classes = [
      "document-card",
      "uk-card",
      "uk-card-body",
      "uk-border-rounded-circular",
      "uk-padding-remove",
    ];

    if (this.args.isSelected) {
      classes.push("document-card--selected");
    }

    this.args.document.marks.forEach((mark) => {
      classes.push(`document-card--mark-${mark.id}`);
    });

    return classes.join(" ");
  }

  get showLoadingState() {
    return this.download.isRunning || this.delete.isRunning;
  }

  @task *download() {
    if (this.args.document || this.args?.documents.length === 1) {
      // If we download a single file we can use the saveAs library
      const doc = this.args.document || this.args?.documents[0];
      try {
        const file = doc.files
          .toArray() // convert to array to not mutate the original
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .find((file) => file.variant === "original");
        const extension = file.name.includes(".")
          ? `.${file.name.split(".").slice(-1)[0]}`
          : "";
        const fileName = doc.title.endsWith(extension)
          ? doc.title
          : doc.title + extension;

        // keep in mind that for the filename to be considered, the request needs
        // to be same-origin (i.e. object storage needs to be deployed with a proxy)
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a?retiredLocale=de#attributes
        yield saveAs(file.downloadUrl, fileName);
      } catch (error) {
        new ErrorHandler(this, error).notify("alexandria.errors.save-file");
      }
    } else {
      // If we want to save a zip of files we need to do some more stuff
      // Compile an array of original file PKs
      const originalFilePKs = encodeURIComponent(
        this.args.documents
          .map((doc) => doc.files.find((file) => file.variant === "original"))
          .map((f) => f.id)
          .join(","),
      );

      let url = this.config?.zipDownloadHost || ""; // in case we need to send the zipDownload to another URL
      url += this.config?.zipDownloadNamespace || ""; // in case we need to namespace the alexandria api
      url += "/api/v1/files/multi";
      url += `?filter[files]=${originalFilePKs}`; // list of files we want to download

      // Some alexandria applications require the document-meta as well
      if (this.config.modelMetaFilters.document) {
        url += `&filter[document-metainfo]=${encodeURIComponent(
          JSON.stringify(this.config.modelMetaFilters.document),
        )}`;
      }

      const transfer = yield this.fetch.fetch(url, { mode: "cors" });
      const bytes = yield transfer.blob();
      saveAs(bytes, `Download-${this.args.documents.length}-files.zip`);
    }
  }
}
