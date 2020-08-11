import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { lastValue, task } from "ember-concurrency-decorators";

export default class TagFilterComponent extends Component {
  @service store;
  @service router;

  @lastValue("fetchTags") tags;

  @task
  *fetchTags() {
    return yield this.store.query("tag", {
      ...this.args.filters,
    });
  }

  @action
  toggleTag(tag) {
    this.router.transitionTo({
      queryParams: {
        tags: this.args.selectedTags.includes(tag.id)
          ? this.args.selectedTags.filter((tagId) => tag.id !== tagId)
          : [...this.args.selectedTags, tag.id],
      },
    });
  }
}
