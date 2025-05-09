import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { trackedFunction } from "reactiveweb/function";

export default class TagFilterComponent extends Component {
  @service router;
  @service("alexandria-tags") tags;
  @service("alexandria-marks") marks;
  @service store;

  get parsedSelected() {
    const parse = (str) => (str ? str.split(",") : []);

    return {
      tags: parse(this.args.selectedTags),
      marks: parse(this.args.selectedMarks),
    };
  }

  availableTags = trackedFunction(this, async () => {
    // Needed to trigger a recompute for the displayed filters
    this.tags.tagUpdates;
    if (!this.args.documents) {
      return [];
    }

    const tags = this.store.peekAll("tag");
    const availableTags = await this.args.documents.reduce(async (acc, doc) => {
      acc = await acc;
      (await doc.tags).forEach((tag) => acc.add(tag.id));

      return acc;
    }, new Set());

    return tags.filter((tag) => availableTags.has(tag.id));
  });

  availableMarks = trackedFunction(this, async () => {
    const marks = this.marks.marks.records;

    if (!this.args.documents || !marks) {
      return [];
    }
    // Needed to trigger a recompute for the displayed filters
    this.marks.markUpdates;

    const availableMarks = await this.args.documents.reduce(
      async (acc, doc) => {
        acc = await acc;
        (await doc.marks).forEach((mark) => acc.add(mark.id));

        return acc;
      },
      new Set(),
    );

    return marks.filter((mark) => availableMarks.has(mark.id));
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
