import Route from "@ember/routing/route";

const PARAM_OPTIONS = { refreshModel: true };

export default class SearchRoute extends Route {
  queryParams = {
    search: PARAM_OPTIONS,
  };
  resetController(controller) {
    /* Depending on how ember alexandria is used we might have to reset
    the document selection on navigation */
    controller.setProperties({
      search: undefined,
    });
  }
}
