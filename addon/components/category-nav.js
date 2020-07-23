import Component from "@glimmer/component";
import { lastValue, task } from "ember-concurrency-decorators";
import { inject as service } from "@ember/service";

export default class CategoryNavComponent extends Component {
  @service store;

  @lastValue("fetchCategories") categories;
  @task
  *fetchCategories() {
    return yield this.store.findAll("category");
  }
}
