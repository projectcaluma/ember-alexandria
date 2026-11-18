import { service } from "@ember/service";
import { attr, hasMany } from "@ember-data/model";
import { LocalizedModel, localizedAttr } from "ember-localized-model";

export default class MarkModel extends LocalizedModel {
  @service("alexandria-config") config;

  @localizedAttr name;
  @localizedAttr description;
  @attr metainfo;

  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;
  @attr modifiedAt;
  @attr modifiedByUser;
  @attr modifiedByGroup;

  @hasMany("document", { inverse: "marks", async: true }) documents;

  get icon() {
    return this.config.markIcons[this.id];
  }

  /**
   * Whether documents in `category` may have this mark. Limited with
   * `metainfo.categories` (slugs, children included), checked by the backend.
   */
  allowsCategory(category) {
    const allowed = this.metainfo?.categories;
    if (!allowed?.length) {
      return true;
    }
    return (
      Boolean(category) &&
      (allowed.includes(category.id) ||
        allowed.includes(category.belongsTo("parent").id()))
    );
  }
}
