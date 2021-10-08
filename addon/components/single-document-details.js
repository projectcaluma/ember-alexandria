import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { restartableTask, dropTask } from "ember-concurrency-decorators";

import DocumentCard from "./document-card";

// TODO: This should be refactored and the SingleDocumentDetailsComponent should NOT
// be inheriting from DocumentCard
export default class SingleDocumentDetailsComponent extends DocumentCard {
  @service router;
  @service documents;
  @service tags;
  @service sidePanel;

  @tracked editTitle = false;
  @tracked editDescription = false;
  @tracked validTitle = true;
  @tracked matchingTags = [];

  @action updateDocumentTitle({ target: { value: title } }) {
    this.validTitle = Boolean(title);
    this.args.document.title = title;
  }

  @action updateDocumentDescription({ target: { value: description } }) {
    this.args.document.description = description;
  }

  @action toggleEditDescription() {
    this.editDescription = !this.editDescription;
    if (this.editDescription) {
      this.documents.disableShortcuts();
    } else {
      this.documents.enableShortcuts();
    }
  }
  @action toggleEditTitle() {
    this.editTitle = !this.editTitle;
    if (this.editTitle) {
      this.documents.disableShortcuts();
    } else {
      this.documents.enableShortcuts();
    }
  }

  @action resetState() {
    this.editTitle = false;
    this.validTitle = true;
    this.editDescription = false;
    this.documents.enableShortcuts();
  }

  @restartableTask *saveDocument() {
    try {
      yield this.args.document.save();
      this.resetState();
      this.notification.success(this.intl.t("alexandria.success.update"));
    } catch {
      this.notification.danger(this.intl.t("alexandria.errors.update"));
    }
  }

  @dropTask *uploadReplacement(event) {
    try {
      const [file] = event.target.files;
      yield this.documents.replace(this.args.document, file);
    } catch {
      this.notification.danger(
        this.intl.t("alexandria.errors.replace-document")
      );
    }
  }
}
