import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { lastValue, task } from "ember-concurrency-decorators";

export default class DocumentGridComponent extends Component {
  @service store;

  @lastValue("fetchDocuments") documents;
  @task
  *fetchDocuments() {
    return yield this.store.query("document", {
      include: "category",
      filter: { ...this.args.filters },
    });
  }
}
