import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { isEmpty } from "@ember/utils";

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
    /* Depending on how ember alexandria is used we might have to reset
    the document selection on navigation */
    if (isEmpty(transition.to.queryParams)) {
      this.documents.clearDocumentSelection();
    }
    this.config.alexandriaQueryParams = transition.to.parent.params;
    this.config.activeGroup = transition.to.queryParams.activeGroup;
  }
}
