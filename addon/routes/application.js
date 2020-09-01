import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ApplicationRoute extends Route {
  @service config;

  model(_, transition) {
    this.config.alexandriaQueryParams = transition.to.parent.params;
  }
}
