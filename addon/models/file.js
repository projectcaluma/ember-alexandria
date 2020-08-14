import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

export default class FileModel extends Model {
  @attr type;
  @attr name;
  @attr uploadUrl;
  @attr downloadUrl;
  @attr objectName;
  @attr meta;

  @belongsTo document;

  @belongsTo("file", { inverse: "renderings" }) original;
  @hasMany("file", { inverse: "original" }) renderings;
}
