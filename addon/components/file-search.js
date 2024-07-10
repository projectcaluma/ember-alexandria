import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";
import { trackedFunction } from "reactiveweb/function";

export default class DocumentViewComponent extends Component {
  @service store;
  @service("alexandria-config") config;
  @service("alexandria-documents") documents;

  @tracked listView = true;
  @tracked search = "";

  @action toggleView() {
    this.listView = !this.listView;
  }

  fetchedDocuments = trackedFunction(this, async () => {
    if (!this.args.filters.query) {
      return [];
    }

    const files = await this.store.query(
      "file",
      {
        include: "document,renderings",
        filter: this.args.filters || {},
        page: { number: 1 },
      },
      {
        adapterOptions: {
          customEndpoint: "search",
        },
      },
    );

    const documents = Array.from(
      new Map(
        files.map((file) => [
          file.document.id,
          this.store.peekRecord("document", file.document.id),
        ]),
      ).values(),
    );

    return await this.config.documentsPostProcess(documents);
  });

  openDocument = task(async (selectedDocument, event) => {
    event.preventDefault();

    await this.documents.download.perform([selectedDocument]);
  });

  get tableColumns() {
    return {
      type: {
        label: "type",
        labelHidden: true,
      },
      title: {
        label: "document-title",
      },
      marks: {
        label: "marks",
        labelHidden: true,
      },
      link: {
        label: "link",
        labelHidden: true,
      },
      date: {
        label: "date",
      },
      modifiedAt: {
        label: "modified-at",
      },
      createdByUser: {
        label: "created-by-user",
      },
      createdByGroup: {
        label: "created-by-group",
      },
    };
  }
}
