import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { restartableTask, dropTask } from "ember-concurrency";
import { DateTime } from "luxon";

import DocumentCard from "./document-card";

import { ErrorHandler } from "ember-alexandria/helpers/error-handler";

// TODO: This should be refactored and the SingleDocumentDetailsComponent should NOT
// be inheriting from DocumentCard
export default class SingleDocumentDetailsComponent extends DocumentCard {
  @service router;
  @service documents;
  @service tags;
  @service sidePanel;
  @service intl;

  @tracked editTitle = false;
  @tracked editDescription = false;
  @tracked editDate = false;
  @tracked validTitle = true;

  get dateFormat() {
    const language = this.intl.primaryLocale.split("-")[0];
    const defaultFormat = "m/d/Y";
    const formats = { de: "d.m.Y", fr: "d.m.Y", en: defaultFormat };

    return formats[language] ?? defaultFormat;
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

  @restartableTask *saveDocument(event) {
    event?.preventDefault();

    try {
      yield this.args.document.save();
      this.resetState();
      this.notification.success(this.intl.t("alexandria.success.update"));
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.update");
    }
  }

  @dropTask *uploadReplacement(event) {
    try {
      const [file] = event.target.files;
      yield this.documents.replace(this.args.document, file);
    } catch (error) {
      new ErrorHandler(this, error).notify(
        "alexandria.errors.replace-document",
      );
    }
  }
}
