import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class DocumentListComponent extends Component {
  get columnCount() {
    return Object.keys(this.args.columns).length;
  }

  @action
  sortIcon(sortKey, currentSort) {
    if (currentSort === sortKey) {
      return "sort-up";
    }
    if (currentSort === `-${sortKey}`) {
      return "sort-down";
    }
    return "sort";
  }
}
