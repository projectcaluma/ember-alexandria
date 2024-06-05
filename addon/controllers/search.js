import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class SearchController extends Controller {
  queryParams = ["search"];

  @service("alexandria-config") config;

  @tracked search;
  @tracked sort;

  get filters() {
    const filters = {
      query: this.search,
    };

    return filters;
  }
}
