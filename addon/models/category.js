import { attr, hasMany } from "@ember-data/model";
import { LocalizedModel, localizedAttr } from "ember-localized-model";

export default class CategoryModel extends LocalizedModel {
  @localizedAttr name;
  @attr description;
  @attr color;
  @attr meta;

  @hasMany documents;
}
