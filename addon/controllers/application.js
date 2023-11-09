import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class ApplicationController extends Controller {
  queryParams = [
    "category",
    "tags",
    "marks",
    "search",
    "document",
    "activeGroup",
    "sort",
  ];

  @service config;

  @tracked category;
  @tracked tags = [];
  @tracked marks = [];
  @tracked search;
  @tracked document;
  @tracked activeGroup;
  @tracked sort;

  get documentFilters() {
    let filters = {
      category: this.category,
      tags: this.tags.length ? this.tags.join(",") : undefined,
      marks: this.marks.length ? this.marks.join(",") : undefined,
      search: this.search,
      activeGroup: this.activeGroup,
    };

    if (this.config && this.config.modelMetaFilters?.document) {
      filters = {
        ...filters,
        metainfo: JSON.stringify(this.config.modelMetaFilters.document),
      };
    }

    return filters;
  }

  removeTagFromTags(tagToRemove) {
    if (this.tags.length) {
      this.tags = this.tags.filter((tag) => tag !== tagToRemove);
    }
  }
}
