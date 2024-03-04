import Model, { attr, belongsTo, hasMany } from "@ember-data/model";
import { task } from "ember-concurrency";
import { saveAs } from "file-saver";
import { DateTime } from "luxon";

import { ErrorHandler } from "ember-alexandria/helpers/error-handler";

export default class FileModel extends Model {
  @attr variant;
  @attr name;
  @attr downloadUrl;
  @attr webdavUrl;
  @attr metainfo;
  @attr content; // needed for upload
  @attr mimeType;
  @attr checksum;

  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;
  @attr modifiedAt;
  @attr modifiedByUser;
  @attr modifiedByGroup;

  @belongsTo("document", { inverse: "files", async: true }) document;

  @belongsTo("file", { inverse: "renderings", async: true }) original;
  @hasMany("file", { inverse: "original", async: true }) renderings;

  get isDownloadUrlExpired() {
    const expiryRegex = /expires=([0-9]+)/;
    const match = this.downloadUrl.match(expiryRegex);
    return DateTime.fromSeconds(Number(match[1])) < DateTime.now();
  }

  download = task({ drop: true }, async () => {
    try {
      if (this.isDownloadUrlExpired) {
        await this.reload();
      }
      const extension = this.name.includes(".")
        ? `.${this.name.split(".").slice(-1)[0]}`
        : "";
      const documentTitle = this.document.get("title");
      const fileName = documentTitle.endsWith(extension)
        ? documentTitle
        : documentTitle + extension;

      // keep in mind that for the filename to be considered, the request needs
      // to be same-origin (i.e. object storage needs to be deployed with a proxy)
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a?retiredLocale=de#attributes
      saveAs(this.downloadUrl, fileName);
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.save-file");
    }
  });
}
