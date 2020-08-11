import { belongsTo, hasMany, attr } from "@ember-data/model";
import { LocalizedModel, localizedAttr } from "ember-localized-model";

export default class DocumentModel extends LocalizedModel {
  @localizedAttr title;
  @localizedAttr description;
  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;

  @belongsTo category;
  @hasMany tags;
  @hasMany files;

  get thumbnail() {
    const thumbnail = this.files.filter((file) => file.type === "thumbnail")[0];
    return thumbnail && thumbnail.downloadUrl;
  }
}
