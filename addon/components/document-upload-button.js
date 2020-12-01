import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { task, lastValue } from "ember-concurrency-decorators";

export default class DocumentUploadButtonComponent extends Component {
  @service notification;
  @service intl;
  @service store;
  @service document;

  @lastValue("fetchCategories") categories;

  @task *upload(category, { target: { files = [] } = {} }) {
    try {
      yield this.document.upload(category, files);

      this.notification.success(
        this.intl.t("alexandria.success.upload-document", {
          count: files.length,
        })
      );

      this.args.afterUpload();
    } catch (error) {
      this.notification.danger(
        this.intl.t("alexandria.errors.upload-document", {
          count: files.length,
        })
      );
    }
  }

  @task *fetchCategories() {
    try {
      return yield this.store.peekAll("category") ||
        this.store.findAll("category");
    } catch (e) {
      this.notification.danger(
        this.intl.t("alexandria.errors.fetch-categories")
      );
    }
  }
}
