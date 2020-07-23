import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

export default class DocumentModel extends Model {
  @attr name;
  @attr description;

  @belongsTo category;
  @hasMany tags;
}
