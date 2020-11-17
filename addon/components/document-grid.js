import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { wrapGrid } from "animate-css-grid";
import { lastValue, task } from "ember-concurrency-decorators";

export default class DocumentGridComponent extends Component {
  @service notification;
  @service config;
  @service store;
  @service intl;

  @tracked isDragOver = false;

  get selectedDocument() {
    if (this.args.selectedDocumentId) {
      return (
        this.documents &&
        this.store.peekRecord("document", this.args.selectedDocumentId)
      );
    }
    return undefined;
  }

  @lastValue("fetchDocuments") documents;
  @task
  *fetchDocuments() {
    return yield this.store.query("document", {
      include: "category,files,tags",
      filter: this.args.filters || {},
    });
  }

  @action scrollIntoView(element, [isSelected] = []) {
    if (isSelected) {
      window.setTimeout(
        () =>
          element.scrollIntoView({
            block: "start",
            inline: "nearest",
            behavior: "smooth",
          }),
        500
      );
    }
  }

  @action setupGridAnimations(element) {
    wrapGrid(element);
  }

  // Drag'n'Drop document upload

  @action onDragEnter() {
    if (!this.args.filters.category) {
      return;
    }

    this.isDragOver = true;
  }

  @action onDragLeave() {
    this.isDragOver = false;
  }

  @action onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  @action async onDrop(event) {
    if (!this.args.filters.category) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const { files } = event.dataTransfer;

    try {
      const category =
        (await this.store.peekRecord("category", this.args.filters.category)) ||
        this.store.findRecord("category", this.args.filters.category);

      await Promise.all(
        Array.from(files).map(async (file) => {
          const documentModel = this.store.createRecord("document", {
            category,
            meta: this.config.defaultModelMeta.document,
          });
          documentModel.title = file.name;
          await documentModel.save();

          const fileModel = this.store.createRecord("file", {
            name: file.name,
            type: "original",
            document: documentModel,
          });
          await fileModel.save();

          const response = await fetch(fileModel.uploadUrl, {
            method: "PUT",
            body: file,
          });

          if (!response.ok) {
            throw new Error("The request returned an error status code");
          }
        })
      );

      this.notification.success(
        this.intl.t("alexandria.success.upload-document", {
          count: files.length,
        })
      );

      await this.fetchDocuments.perform();
    } catch (error) {
      this.notification.danger(
        this.intl.t("alexandria.errors.upload-document", {
          count: files.length,
        })
      );
    }

    this.isDragOver = false;
  }
}
