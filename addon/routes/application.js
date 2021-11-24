import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

const PARAM_OPTIONS = { refreshModel: true };

export default class ApplicationRoute extends Route {
  queryParams = {
    category: PARAM_OPTIONS,
    tags: PARAM_OPTIONS,
    search: PARAM_OPTIONS,
    document: PARAM_OPTIONS,
    activeGroup: PARAM_OPTIONS,
  };

  @service config;

  model() {}

  afterModel(model, transition) {
    this.config.alexandriaQueryParams = transition.to.parent.params;
    this.config.activeGroup = transition.to.queryParams.activeGroup;
  }
}
