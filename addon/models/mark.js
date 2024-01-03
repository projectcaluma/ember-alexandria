import { inject as service } from "@ember/service";
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
}
