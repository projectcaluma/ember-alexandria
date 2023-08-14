import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { query } from "ember-data-resources";

export default class CategoryNavComponent extends Component {
  @service store;
  @service notification;
  @service intl;

  categories = query(this, "category", () => ({
    "filter[hasParent]": false,
    include: "children",
  }));
}
