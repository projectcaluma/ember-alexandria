import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { task, restartableTask } from "ember-concurrency-decorators";

import DocumentCard from "./document-card";

export default class DocumentDetailsComponent extends DocumentCard {
  @tracked editTitle = false;
  @tracked validTitle = true;

  @action updateDocumentTitle({ target: { value: title } }) {
    this.validTitle = Boolean(title);
    this.args.document.title = title;
  }

  @action resetState() {
    this.editTitle = false;
    this.validTitle = true;
  }

  @task *deleteAndReset(...args) {
    try {
      // Cant use super.delete here since concurrency always takes the current class for perform and this causes recursion here.
      yield this.delete.perform(...args);
      this.notification.success(
        this.intl.t("alexandria.success.delete-document")
      );
    } catch (error) {
      this.notification.danger(
        this.intl.t("alexandria.errors.delete-document")
      );
    }
  }

  @restartableTask *saveDocument() {
    try {
      yield this.args.document.save();
      this.editTitle = false;
      this.notification.success(this.intl.t("alexandria.success.update"));
    } catch (error) {
      this.notification.danger(this.intl.t("alexandria.errors.update"));
    }
  }
}
