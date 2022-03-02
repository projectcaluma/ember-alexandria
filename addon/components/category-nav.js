import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { lastValue, task } from "ember-concurrency";

export default class CategoryNavComponent extends Component {
  @service store;
  @service notification;
  @service intl;

  @lastValue("fetchCategories") categories;
  @task
  *fetchCategories() {
    try {
      return yield this.store.findAll("category");
    } catch {
      this.notification.danger(
        this.intl.t("alexandria.errors.fetch-categories")
      );
    }
  }
}
