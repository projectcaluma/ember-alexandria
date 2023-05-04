import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class TagFilterComponent extends Component {
  @service router;
  @service tags;

  get selectedTagsArray() {
    // Selected tags come directly from the query parameter and are strings.
    return typeof this.args.selectedTags === "string"
      ? this.args.selectedTags.split(",")
      : [];
  }

  @action onInsert() {
    this.tags.category = this.args.category;
    this.tags.fetchSearchTags.perform();
  }

  @action toggleTag(tag) {
    let tags;

    if (this.selectedTagsArray.includes(tag.id)) {
      const remaining = this.selectedTagsArray.filter(
        (tagId) => tag.id !== tagId
      );
      tags = remaining.length > 0 ? remaining : null;
    } else {
      tags = [...this.selectedTagsArray, tag.id];
    }

    this.router.transitionTo(this.router.currentRouteName, {
      queryParams: { tags },
    });
  }
}
