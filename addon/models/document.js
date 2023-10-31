import { inject as service } from "@ember/service";
import { belongsTo, hasMany, attr } from "@ember-data/model";
import { LocalizedModel, localizedAttr } from "ember-localized-model";
import { TrackedObject } from "tracked-built-ins";

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
  @hasMany("file", { inverse: "document", async: true }) files;

  @service config;

  get thumbnail() {
    const thumbnail = this.files.filter(
      (file) => file.variant === "thumbnail",
    )[0];
    return thumbnail && thumbnail.downloadUrl;
  }

  get marks() {
    return this.config.marks.map((mark) => {
      mark.active = this.tags.find((tag) => tag.name === mark.type);
      return new TrackedObject(mark);
    });
  }
}
