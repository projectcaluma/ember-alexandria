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
  @service documents;

  @tracked isDragOver = false;
  @tracked dragCounter = 0;

  get canDrop() {
    return Boolean(this.args.filters && this.args.filters.category);
  }

  get selectedDocument() {
    if (this.args.selectedDocumentId) {
      return (
        this.fetchedDocuments &&
        this.store.peekRecord("document", this.args.selectedDocumentId)
      );
    }
    return undefined;
  }

  @lastValue("fetchDocuments") fetchedDocuments;
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
    this.dragCounter++;
    this.isDragOver = true;
  }

  @action onDragLeave() {
    this.dragCounter--;
    this.isDragOver = this.dragCounter > 0;
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
      await this.documents.upload(this.args.filters.category, files);

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
