import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class DocumentListComponent extends Component {
  get columnCount() {
    return Object.keys(this.args.columns).length;
  }

  @action
  sortIcon(key, currentSort, sortKey) {
    const keyToCheck = sortKey ? sortKey : key;

    if (currentSort === keyToCheck) {
      return "sort-up";
    }
    if (currentSort === `-${keyToCheck}`) {
      return "sort-down";
    }
    return "sort";
  }
}
