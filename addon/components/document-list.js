import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class DocumentListComponent extends Component {
  get columnCount() {
    return Object.keys(this.args.columns).length;
  }

  @action
  sortIcon(key, currentSort, sortKey) {
    const sort = sortKey ? sortKey : key;
    const sortConfigs = Array.isArray(sort) ? sort : [{ key: sort }];
    const keysToCheck = sortConfigs.map((s) => s.key);

    const currentSortName = `${currentSort}`.replace("-", "");

    if (keysToCheck.includes(currentSortName)) {
      const sortConfig = sortConfigs.find((s) => s.key === currentSortName);
      const sortIcons = sortConfig.icons ?? ["sort-up", "sort-down"];

      return currentSort.startsWith("-") ? sortIcons[1] : sortIcons[0];
    }

    return "sort";
  }
}
