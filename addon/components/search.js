import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { macroCondition, isTesting } from "@embroider/macros";
import Component from "@glimmer/component";
import { timeout, restartableTask } from "ember-concurrency";

export default class SearchComponent extends Component {
  @service router;

  @action onSubmit(event) {
    event.preventDefault();
  }

  @restartableTask *updateSearch({ target: { value: search } }) {
    if (macroCondition(isTesting())) {
      // no timeout
    } else {
      yield timeout(1000);
    }

    this.router.transitionTo({
      queryParams: { search: search || undefined, category: undefined },
    });
  }
}
