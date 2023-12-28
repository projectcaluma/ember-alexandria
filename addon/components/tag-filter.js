import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { trackedFunction } from "ember-resources/util/function";
export default class TagFilterComponent extends Component {
  @service router;
  @service tags;
  @service marks;
  @service store;

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

  activeMarks = trackedFunction(this, async () => {
    const activeMarks = await this.store
      .peekAll("document")
      .reduce(async (acc, doc) => {
        const marks = await doc.marks;
        if (
          (this.args.category === undefined ||
            (await doc.category) === this.args.category) &&
          marks.length > 0
        ) {
          marks.forEach((mark) => acc.add(mark.id));
        }

        return acc;
      }, new Set());

    return this.marks.marks.records?.filter((mark) => activeMarks.has(mark.id));
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
