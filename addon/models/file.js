import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

export default class FileModel extends Model {
  @attr type;
  @attr name;
  @attr uploadUrl;
  @attr downloadUrl;
  @attr objectName;
  @attr meta;

  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;
  @attr modifiedAt;
  @attr modifiedByUser;
  @attr modifiedByGroup;

  @belongsTo document;

  @belongsTo("file", { inverse: "renderings" }) original;
  @hasMany("file", { inverse: "original" }) renderings;
}
