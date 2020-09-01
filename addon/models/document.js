import { belongsTo, hasMany } from "@ember-data/model";
import { LocalizedModel, localizedAttr } from "ember-localized-model";

export default class DocumentModel extends LocalizedModel {
  @localizedAttr title;
  @localizedAttr description;

  @belongsTo category;
  @hasMany tags;
  @hasMany files;

  get thumbnail() {
    const thumbnail = this.files.filter((file) => file.type === "thumbnail")[0];
    return thumbnail && thumbnail.downloadUrl;
  }
}
