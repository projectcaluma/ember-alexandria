import { service } from "@ember/service";
import Model, { attr, belongsTo, hasMany } from "@ember-data/model";
import { task } from "ember-concurrency";

import { isDownloadUrlExpired } from "ember-alexandria/utils/download";
import { ErrorHandler } from "ember-alexandria/utils/error-handler";
import { getFileType, getIcon } from "ember-alexandria/utils/file-type";

export default class FileModel extends Model {
  @service("alexandria-config") config;
  @service intl;

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

  get fileTypeInfo() {
    const fileType = getFileType(
      this.mimeType,
      this.config.additionalFileTypes,
    );
    let label = fileType
      ? this.intl.t(`alexandria.document-details.file-types.${fileType}`)
      : this.mimeType;

    if (Object.keys(this.config.additionalFileTypes).includes(fileType)) {
      label = this.config.additionalFileTypes[fileType].label;
    }

    return {
      icon: getIcon(fileType, this.config.additionalFileTypes),
      label,
    };
  }
}
