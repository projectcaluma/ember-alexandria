import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";

import { ErrorHandler } from "ember-alexandria/utils/error-handler";

export default class DocumentDeleteButtonComponent extends Component {
  @service notification;
  @service intl;
  @service("alexandria-documents") documents;
  @service router;

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

  @task *delete() {
    try {
      if (this.args.docsToDelete) {
        const docs = Array.isArray(this.args.docsToDelete)
          ? this.args.docsToDelete
          : [this.args.docsToDelete]; // if the supplied argument is not an array we make it one

        for (const doc of docs) {
          yield doc.destroyRecord().catch((error) => {
            doc.rollbackAttributes();
            throw error;
          });
          this.documents.deselectDocument(doc);
        }
      }

      if (this.args.onConfirm) {
        this.args.onConfirm(this.args.docsToDelete);
      }

      this.notification.success(
        this.intl.t("alexandria.success.delete-document"),
      );
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.delete-document");
    } finally {
      this.hideDialog();
    }
  }
}
