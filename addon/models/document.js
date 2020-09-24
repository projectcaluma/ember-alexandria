import { belongsTo, hasMany, attr } from "@ember-data/model";
import { LocalizedModel, localizedAttr } from "ember-localized-model";

export default class DocumentModel extends LocalizedModel {
  @localizedAttr title;
  @localizedAttr description;
  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;
  @attr meta;

  @belongsTo category;
  @hasMany tags;
  @hasMany files;

  get thumbnail() {
    const thumbnail = this.files.find((file) => file.type === "thumbnail");
    return thumbnail && thumbnail.downloadUrl;
  }
}
