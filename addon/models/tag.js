import { attr, hasMany } from "@ember-data/model";
import { LocalizedModel, localizedAttr } from "ember-localized-model";

export default class TagModel extends LocalizedModel {
  @attr name;
  @localizedAttr description;
  @attr metainfo;

  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;
  @attr modifiedAt;
  @attr modifiedByUser;
  @attr modifiedByGroup;

  @hasMany("document", { inverse: "tags", async: true }) documents;
}
