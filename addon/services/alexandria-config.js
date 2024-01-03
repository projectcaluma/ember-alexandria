import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class AlexandriaConfigService extends Service {
  markIcons = {};

  @tracked alexandriaQueryParams = {};

  /**
   * The active group is used for the createdByGroup property when creating new
   * documents and files. This is important as a user can be in multiple groups.
   */
  @tracked activeGroup = null;

  /**
   * Defaults so we can lookup
   * `this.config.modelMetaFilters.document`
   * without an exeption on modelMetaFilters.
   */
  get modelMetaFilters() {
    return {};
  }

  get defaultModelMeta() {
    return {};
  }

  get suggestedTagsFilters() {
    return {};
  }

  resolveUser(id) {
    return id;
  }

  resolveGroup(id) {
    return id;
  }

  documentsPostProcess(documents) {
    return documents;
  }
}
