import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency-decorators";

export default class DocumentDeleteButtonComponent extends Component {
  @service notification;
  @service intl;

  @tracked dialogVisible = false;

  @action showDialog() {
    this.dialogVisible = true;
  }

  @action hideDialog() {
    this.dialogVisible = false;

    if (this.args.onCancel) {
      this.args.onCancel();
    }
  }

  @task *delete() {
    try {
      yield this.args.document.destroyRecord();

      if (this.args.onConfirm) {
        this.args.onConfirm(this.args.document);
      }

      this.hideDialog();

      this.notification.success(
        this.intl.t("alexandria.success.delete-document")
      );
    } catch (error) {
      this.notification.danger(
        this.intl.t("alexandria.errors.delete-document")
      );
    }
  }
}
