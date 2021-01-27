import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { timeout } from "ember-concurrency";
import { restartableTask } from "ember-concurrency-decorators";

export default class SearchComponent extends Component {
  @service router;

  @action onSubmit(event) {
    event.preventDefault();
  }

  @restartableTask *updateSearch({ target: { value: search } }) {
    if (!Ember.testing) {
      yield timeout(1000);
    }
    this.router.transitionTo({
      queryParams: { search: search || undefined, category: undefined },
    });
  }
}
