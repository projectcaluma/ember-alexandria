import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class IndexController extends Controller {
  queryParams = [
    "category",
    "tags",
    "marks",
    "search",
    "document",
    "activeGroup",
    "sort",
    "listView",
  ];

  @service("alexandria-config") config;

  @tracked category;
  @tracked tags = [];
  @tracked marks = [];
  @tracked search;
  @tracked document;
  @tracked activeGroup;
  @tracked sort;
  @tracked listView = true;

  get documentFilters() {
    let filters = {
      categories: this.category,
      tags: this.tags.length ? this.tags.join(",") : undefined,
      marks: this.marks.length ? this.marks.join(",") : undefined,
      query: this.search,
      activeGroup: this.activeGroup,
    };

    if (this.config && this.config.modelMetaFilters?.document) {
      filters = {
        ...filters,
        documentMetainfo: JSON.stringify(this.config.modelMetaFilters.document),
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
