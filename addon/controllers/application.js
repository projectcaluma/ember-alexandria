import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class ApplicationController extends Controller {
  queryParams = [
    "category",
    "tags",
    "search",
    "document",
    "activeGroup",
    "sort",
  ];

  @service config;

  @tracked category;
  // Cant use @tracked tags = []; because of https://github.com/emberjs/ember.js/issues/19078
  @tracked tags;
  @tracked search;
  @tracked document;
  @tracked activeGroup;
  @tracked sort;

  get documentFilters() {
    let filters = {
      category: this.category,
      tags: this.tags,
      search: this.search,
      activeGroup: this.activeGroup,
    };

    if (this.config && this.config.modelMetaFilters.document) {
      filters = {
        ...filters,
        meta: JSON.stringify(this.config.modelMetaFilters.document),
      };
    }

    return filters;
  }
}
