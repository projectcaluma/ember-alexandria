import { attr, hasMany } from "@ember-data/model";
import { LocalizedModel, localizedAttr } from "ember-localized-model";

export default class TagModel extends LocalizedModel {
  @attr name;
  @localizedAttr description;
  @attr meta;

  @hasMany documents;
}
