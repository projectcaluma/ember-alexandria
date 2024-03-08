import Model, { attr, belongsTo, hasMany } from "@ember-data/model";
import { task } from "ember-concurrency";

import { isDownloadUrlExpired } from "ember-alexandria/helpers/download";
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
    return isDownloadUrlExpired(this.downloadUrl);
  }

  download = task({ drop: true }, async () => {
    try {
      if (this.isDownloadUrlExpired) {
        await this.reload();
      }

      open(this.downloadUrl);
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.save-file");
    }
  });
}
