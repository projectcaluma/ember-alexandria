import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";

export default class DocumentDeleteButtonComponent extends Component {
  @service notification;
  @service intl;
  @service documents;
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

        yield docs.forEach((doc) => {
          this.documents.deselectDocument(doc);
          doc.destroyRecord();
        });
      }

      if (this.args.onConfirm) {
        this.args.onConfirm(this.args.docsToDelete);
      }

      this.hideDialog();

      this.notification.success(
        this.intl.t("alexandria.success.delete-document")
      );
    } catch {
      this.notification.danger(
        this.intl.t("alexandria.errors.delete-document")
      );
    }
  }
}
