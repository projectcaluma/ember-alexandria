import Model, { attr, belongsTo } from "@ember-data/model";

export default class SignatureModel extends Model {
  @attr signatureType;
  @attr signerName;
  @attr signedAt;
  @attr signatureHash;

  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;
  @attr modifiedAt;
  @attr modifiedByUser;
  @attr modifiedByGroup;

  @belongsTo("file", { inverse: null, async: true }) file;
  @belongsTo("signature-request", { inverse: null, async: true })
  signatureRequest;
}
