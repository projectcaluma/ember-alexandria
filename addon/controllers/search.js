import Controller from "@ember/controller";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class SearchController extends Controller {
  queryParams = ["search"];

  @service("alexandria-config") config;

  @tracked search;
  @tracked sort;

  get filters() {
    const filters = {
      onlyNewest: true,
      query: this.search,
    };

    return filters;
  }
}
