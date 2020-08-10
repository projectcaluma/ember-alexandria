import Component from "@glimmer/component";
import { restartableTask } from "ember-concurrency-decorators";
import { inject as service } from "@ember/service";
import { timeout } from "ember-concurrency";

export default class SearchComponent extends Component {
  @service router;

  @restartableTask *updateSearch({ target: { value: search } }) {
    yield timeout(1000);
    this.router.transitionTo({
      queryParams: { search: search || undefined, category: undefined },
    });
  }
}
