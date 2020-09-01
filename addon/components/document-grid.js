import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { lastValue, task } from "ember-concurrency-decorators";

export default class DocumentGridComponent extends Component {
  @service store;

  loadingElementsAmount = 10;

  @lastValue("fetchDocuments") documents;
  @task
  *fetchDocuments() {
    return yield this.store.query("document", {
      include: "category,files",
      filter: { ...this.args.filters },
    });
  }
}
