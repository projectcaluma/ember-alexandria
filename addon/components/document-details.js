import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, restartableTask, dropTask } from "ember-concurrency-decorators";

import DocumentCard from "./document-card";

export default class DocumentDetailsComponent extends DocumentCard {
  @tracked editTitle = false;
  @tracked validTitle = true;

  @service store;

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

  @dropTask *uploadReplacement(event) {
    try {
      const [file] = event.target.files;

      const fileModel = this.store.createRecord("file", {
        name: file.name,
        type: "original",
        document: this.args.document,
      });

      yield fileModel.save();

      const response = yield fetch(fileModel.uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (!response.ok) {
        throw new Error("The request returned an error status code");
      }
    } catch (error) {
      this.notification.danger(
        this.intl.t("alexandria.errors.replace-document")
      );
    }
  }
}
