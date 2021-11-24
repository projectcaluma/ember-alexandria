import { getOwner } from "@ember/application";
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

  get controllerInstance() {
    const applicationInstance = getOwner(this);
    return applicationInstance.lookup("controller:application");
  }

  model() {}

  afterModel(model, transition) {
    this.config.alexandriaQueryParams = transition.to.parent.params;
    this.config.activeGroup = transition.to.queryParams.activeGroup;

    /* If we change the category we need to reset the tags 
    otherwise the user might end up with no documents and 
    no ability to reset the filter unless they go back to 
    the previous category and deselect the filter before navigating 
    to the new category */
    if (
      transition.to?.queryParams?.category !==
      transition.from?.queryParams?.category
    ) {
      this.controllerInstance.resetTagFilter();
    }
  }
}
