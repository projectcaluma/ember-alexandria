import { action } from "@ember/object";
import { service } from "@ember/service";
import { macroCondition, isTesting } from "@embroider/macros";
import Component from "@glimmer/component";
import { timeout, task } from "ember-concurrency";

export default class SearchComponent extends Component {
  @service router;
  @service("alexandria-documents") documents;

  @action onSubmit(event) {
    event.preventDefault();
  }

  @action onFocus() {
    this.documents.disableShortcuts();
  }

  @action onFocusOut() {
    this.documents.enableShortcuts();
  }

  updateSearch = task(
    { restartable: true },
    async ({ target: { value: search } }) => {
      if (macroCondition(isTesting())) {
        // no timeout
      } else {
        await timeout(1000);
      }

      this.router.transitionTo(this.router.currentRouteName, {
        queryParams: { search: search || undefined },
      });
    },
  );

  @action
  resetSearch(event) {
    event.preventDefault();
    this.router.transitionTo(this.router.currentRouteName, {
      queryParams: { search: undefined },
    });
  }
}
