import Model, { attr, hasMany } from "@ember-data/model";

export default class TagModel extends Model {
  @attr name;
  @attr description;

  @hasMany documents;
}
