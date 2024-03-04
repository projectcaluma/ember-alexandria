import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";
import { DateTime } from "luxon";

import { ErrorHandler } from "ember-alexandria/helpers/error-handler";

export default class SingleDocumentDetailsComponent extends Component {
  @service("alexandria-documents") documents;
  @service("alexandria-config") config;
  @service("alexandria-side-panel") sidePanel;
  @service intl;
  @service store;
  @service fetch;
  @service notification;

  @tracked editTitle = false;
  @tracked editDescription = false;
  @tracked editDate = false;
  @tracked validTitle = true;

  get locale() {
    return this.intl.primaryLocale.split("-")[0];
  }

  get dateFormat() {
    const defaultFormat = "m/d/Y";
    const formats = { de: "d.m.Y", fr: "d.m.Y", en: defaultFormat };

    return formats[this.locale] ?? defaultFormat;
  }

  get isWordProcessingFormat() {
    return [
      "application/vnd.oasis.opendocument.text",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(this.args.document.latestFile?.value?.mimeType);
  }

  get displayWebDAVButton() {
    return this.config.enableWebDAV && this.isWordProcessingFormat;
  }

  get displayConvertButton() {
    return this.config.enablePDFConversion && this.isWordProcessingFormat;
  }

  @action updateDocumentTitle({ target: { value: title } }) {
    this.validTitle = Boolean(title);
    this.args.document.title = title;
  }

  @action updateDocumentDescription({ target: { value: description } }) {
    this.args.document.description = description;
  }

  @action async updateDate([date]) {
    this.args.document.date = date
      ? DateTime.fromJSDate(date).toISODate()
      : null;
    await this.saveDocument.perform();
  }

  @action toggle(name) {
    this[name] = !this[name];
    if (this[name]) {
      this.documents.disableShortcuts();
    } else {
      this.documents.enableShortcuts();
    }
  }

  @action resetState() {
    this.editTitle = false;
    this.validTitle = true;
    this.editDescription = false;
    this.editDate = false;
    this.documents.enableShortcuts();
  }

  saveDocument = task({ restartable: true }, async (event) => {
    event?.preventDefault();

    try {
      await this.args.document.save();
      this.resetState();
      this.notification.success(this.intl.t("alexandria.success.update"));
    } catch (error) {
      this.args.document.rollbackAttributes();
      new ErrorHandler(this, error).notify("alexandria.errors.update");
    }
  });

  uploadReplacement = task({ drop: true }, async (event) => {
    try {
      const [file] = event.target.files;
      await this.documents.replace(this.args.document, file);
    } catch (error) {
      new ErrorHandler(this, error).notify(
        "alexandria.errors.replace-document",
      );
    }
  });

  convertDocument = task({ drop: true }, async (event) => {
    event?.preventDefault();
    try {
      const modelName = "document";
      const adapter = this.store.adapterFor(modelName);
      const url = adapter.buildURL(modelName, this.args.document.id);
      await this.fetch.fetch(`${url}/convert`, {
        method: "POST",
      });

      this.args.refreshDocumentList();

      this.notification.success(this.intl.t("alexandria.success.convert-pdf"));
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.convert-pdf");
    }
  });

  openWebDAV = task({ drop: true }, async (event) => {
    event?.preventDefault();
    try {
      const fileId = this.args.document.latestFile.value.id;

      const file = await this.store.findRecord("file", fileId);

      window.open(file.webdavUrl, "_blank");
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.open-webdav");
    }
  });
}
