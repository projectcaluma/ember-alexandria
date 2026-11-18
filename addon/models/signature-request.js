import Model, { attr, belongsTo } from "@ember-data/model";

// Statuses in which the backend still waits for the signature provider
export const ACTIVE_STATUSES = ["open", "requested", "confirmed"];

export default class SignatureRequestModel extends Model {
  @attr signatureType;
  @attr status;
  @attr timeout;
  @attr actionUrl;
  @attr providerStatus;
  @attr isCurrent; // false once the file changed unrelated to signatures
  @attr signerName; // name in the certificate, may differ from the user

  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;
  @attr modifiedAt;
  @attr modifiedByUser;
  @attr modifiedByGroup;

  @belongsTo("file", { inverse: null, async: true }) file;
  // New version created by the signature, unset until done
  @belongsTo("file", { inverse: null, async: true }) signedFile;

  get isActive() {
    return ACTIVE_STATUSES.includes(this.status);
  }

  // Without loading the file
  get fileId() {
    return this.belongsTo("file").id();
  }

  // Version the request belongs to in the history: the version it created,
  // or the version it was started on while not done
  get historyFileId() {
    return this.belongsTo("signedFile").id() ?? this.fileId;
  }

  get statusLabelClass() {
    if (this.status === "done") {
      return "uk-label-success";
    }
    return this.isActive ? "uk-label-warning" : "uk-label-danger";
  }
}
