import { service } from "@ember/service";
import Model, { attr, belongsTo, hasMany } from "@ember-data/model";
import { trackedFunction } from "reactiveweb/function";

export default class DocumentModel extends Model {
  @attr title;
  @attr description;
  @attr metainfo;

  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;
  @attr modifiedAt;
  @attr modifiedByUser;
  @attr modifiedByGroup;
  @attr date;
  @attr content; // needed for upload
  // read only, signatures created in alexandria
  @attr canSign; // whether the user can sign the latest file
  @attr isSigned; // latest file contains a signature
  @attr isStamped; // latest file contains a stamp

  @belongsTo("category", { inverse: "documents", async: true }) category;
  @hasMany("tag", { inverse: "documents", async: true }) tags;
  @hasMany("mark", { inverse: "documents", async: true }) marks;
  @hasMany("file", { inverse: "document", async: true }) files;

  @service("alexandria-config") config;

  thumbnail = trackedFunction(this, async () => {
    // get the thumbnail of the latest file, because thumbnails
    // might be generated out of order
    const thumbnails = await this.latestFile.value?.renderings;

    if (!thumbnails?.length) {
      return undefined;
    }

    return thumbnails.toArray().sort(
      // convert to array to not mutate the original
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )[0].downloadUrl;
    // no need to check for expired URLs here, because the browser caches the images when they are loaded
  });

  // The `stampMark` (config) means "to be stamped", without loading marks
  get isMarkedForStamp() {
    return (
      Boolean(this.config.stampMark) &&
      this.hasMany("marks").ids().includes(this.config.stampMark)
    );
  }

  latestFile = trackedFunction(this, async () => {
    const files = await this.files;
    if (!files.length) {
      return undefined;
    }

    return files
      .filter((file) => file.variant === "original")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  });
}
