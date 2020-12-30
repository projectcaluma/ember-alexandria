import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ApplicationRoute extends Route {
  @service config;

  model(params, transition) {
    this.config.alexandriaQueryParams = transition.to.parent.params;
    this.config.activeGroup = params.activeGroup;
  }
}
