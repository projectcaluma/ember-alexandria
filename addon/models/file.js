import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

export default class FileModel extends Model {
  @attr variant;
  @attr name;
  @attr uploadUrl;
  @attr downloadUrl;
  @attr objectName;
  @attr metainfo;

  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;
  @attr modifiedAt;
  @attr modifiedByUser;
  @attr modifiedByGroup;

  @belongsTo("document", { inverse: "files", async: true }) document;

  @belongsTo("file", { inverse: "renderings", async: true }) original;
  @hasMany("file", { inverse: "original", async: true }) renderings;
}
