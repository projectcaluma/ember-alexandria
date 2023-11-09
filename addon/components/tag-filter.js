import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { trackedFunction } from "ember-resources/util/function";
export default class TagFilterComponent extends Component {
  @service router;
  @service tags;
  @service marks;

  get parsedSelected() {
    const parse = (str) => (str ? str.split(",") : []);

    return {
      tags: parse(this.args.selectedTags),
      marks: parse(this.args.selectedMarks),
    };
  }

  searchTags = trackedFunction(this, async () => {
    return this.tags.fetchSearchTags.perform(this.args.category);
  });

  @action toggle(type, value) {
    const queryParams = {};
    const currentParams = this.parsedSelected[type];
    let newParams;

    if (currentParams.includes(value.id)) {
      const remaining = currentParams.filter((c) => value.id !== c);
      newParams = remaining.length > 0 ? remaining : null;
    } else {
      newParams = [...currentParams, value.id];
    }

    queryParams[type] = newParams;

    this.router.transitionTo(this.router.currentRouteName, { queryParams });
  }
}
