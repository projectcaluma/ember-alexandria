import Component from "@glimmer/component";
import { lastValue, task } from "ember-concurrency-decorators";
import { inject as service } from "@ember/service";

export default class DocumentGridComponent extends Component {
  @service store;

  @lastValue("fetchDocuments") documents;
  @task
  *fetchDocuments() {
    return yield this.store.query("document", {
      include: "category",
      ...this.args.filters,
    });
  }
}
