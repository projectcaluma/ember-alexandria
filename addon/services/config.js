import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class ConfigService extends Service {
  @tracked emeisQueryParams = {};

  /* Defaults so we can lookup
   * `this.config.modelMetaFilters.document`
   * without an exeption on modelMetaFilters.
   */
  get modelMetaFilters() {
    return {};
  }
  get defaultModelMeta() {
    return {};
  }
}
