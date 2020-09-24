import Controller from "@ember/controller";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class ApplicationController extends Controller {
  queryParams = ["category", "tags", "search", "document"];

  @service config;

  @tracked category;
  // Cant use @tracked tags = []; because of https://github.com/emberjs/ember.js/issues/19078
  @tracked tags;
  @tracked search;
  @tracked document;

  get documentFilters() {
    let filters = {
      category: this.category,
      tags: this.tags,
      search: this.search,
    };

    let doc = get(this, "config.modelMetaFilters.document");
    
    if (doc) {
      filters.meta = JSON.stringify(doc);
    }

    return filters;
  }
}
