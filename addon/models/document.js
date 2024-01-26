import { inject as service } from "@ember/service";
import { belongsTo, hasMany, attr } from "@ember-data/model";
import { LocalizedModel, localizedAttr } from "ember-localized-model";

export default class DocumentModel extends LocalizedModel {
  @localizedAttr title;
  @localizedAttr description;
  @attr metainfo;

  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;
  @attr modifiedAt;
  @attr modifiedByUser;
  @attr modifiedByGroup;
  @attr date;

  @belongsTo("category", { inverse: "documents", async: true }) category;
  @hasMany("tag", { inverse: "documents", async: true }) tags;
  @hasMany("mark", { inverse: "documents", async: true }) marks;
  @hasMany("file", { inverse: "document", async: true }) files;

  @service("alexandria-config") config;

  get thumbnail() {
    // get the thumbnail of the latest file, because thumbnails
    // might be generated out of order
    const latestThumb = this.files.find(
      (f) => f.original.id === this.latestFile.id,
    );
    return latestThumb?.downloadUrl;
  }

  get latestFile() {
    if (!this.files.length) {
      return null;
    }

    return this.files
      .filter((file) => file.variant === "original")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  }
}
