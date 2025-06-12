import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";

import { ErrorHandler } from "ember-alexandria/utils/error-handler";

export default class DocumentDeleteButtonComponent extends Component {
  @service notification;
  @service intl;
  @service("alexandria-documents") documents;

  @tracked dialogVisible = false;

  @action showDialog() {
    this.dialogVisible = true;
  }

  @action hideDialog() {
    this.dialogVisible = false;
  }

  @action cancel() {
    this.hideDialog();

    if (this.args.onCancel) {
      this.args.onCancel();
    }
  }

  delete = task(async () => {
    if (!this.args.docsToDelete) {
      return this.hideDialog();
    }

    const docs = Array.isArray(this.args.docsToDelete)
      ? this.args.docsToDelete
      : [this.args.docsToDelete]; // if the supplied argument is not an array we make it one

    if (this.args.onConfirm) {
      this.args.onConfirm(docs);
    }

    const deletionStatus = await Promise.allSettled(
      docs.map((doc) => {
        return doc.destroyRecord();
      }),
    );

    const success = [];
    const rejected = [];
    deletionStatus.forEach((element) => {
      (element.status === "rejected" ? rejected : success).push(element);
    });

    success.forEach((_, index) => {
      this.documents.deselectDocument(docs[index]);
    });

    rejected.forEach((error, index) => {
      docs[index].rollbackAttributes();
      new ErrorHandler(this, error.reason).notify(
        "alexandria.errors.delete-document",
      );
    });

    if (!rejected.length) {
      this.notification.success(
        this.intl.t("alexandria.success.delete-document"),
      );
    }
    this.hideDialog();
  });
}
