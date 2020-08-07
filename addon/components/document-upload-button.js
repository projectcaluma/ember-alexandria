import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { task, lastValue } from "ember-concurrency-decorators";
import fetch from "fetch";

export default class DocumentUploadButtonComponent extends Component {
  @service notification;
  @service intl;
  @service store;

  @lastValue("fetchCategories") categories;

  @task *upload(category, { target: { files = [] } = {} }) {
    try {
      if (!category.id) {
        category = yield this.store.peekRecord("category", category) ||
          this.store.findRecord("category", category);
      }

      yield Promise.all(
        Array.from(files).map(async (file) => {
          const documentModel = this.store.createRecord("document", {
            category,
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
            method: "put",
            body: file,
          });

          console.error("Needs error handling here", response);
        })
      );
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
