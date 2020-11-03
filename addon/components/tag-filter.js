import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { lastValue, task } from "ember-concurrency-decorators";

export default class TagFilterComponent extends Component {
  @service store;
  @service router;

  @lastValue("fetchTags") tags;

  get selectedTagsArray() {
    return typeof this.args.selectedTags === "string"
      ? this.args.selectedTags.split(",")
      : [];
  }

  @task
  *fetchTags() {
    return yield this.store.query("tag", {
      filter: this.args.filters,
    });
  }

  @action
  toggleTag(tag) {
    let tags;

    if (this.selectedTagsArray.includes(tag.id)) {
      const remaining = this.selectedTagsArray.filter(
        (tagId) => tag.id !== tagId
      );
      tags = remaining.length > 0 ? remaining : null;
    } else {
      tags = [...this.selectedTagsArray, tag.id];
    }

    this.router.transitionTo({ queryParams: { tags } });
  }
}
