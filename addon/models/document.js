import { inject as service } from "@ember/service";
import { belongsTo, hasMany, attr } from "@ember-data/model";
import { LocalizedModel, localizedAttr } from "ember-localized-model";
import { trackedFunction } from "reactiveweb/function";

export default class DocumentModel extends LocalizedModel {
  @localizedAttr title;
  @localizedAttr description;
  @attr metainfo;

  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;
  @attr modifiedAt;
  @attr modifiedByUser;
  @attr modifiedByGroup;
  @attr date;

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
