import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { timeout } from "ember-concurrency";
import { restartableTask, dropTask, task } from "ember-concurrency-decorators";

import DocumentCard from "./document-card";

export default class SingleDocumentDetailsComponent extends DocumentCard {
  @service router;
  @service documents;
  @service tags;
  @service sidePanel;

  @tracked editTitle = false;
  @tracked editDescription = false;
  @tracked validTitle = true;
  @tracked matchingTags = [];

  @action closePanel() {
    this.router.transitionTo({ queryParams: { document: undefined } });
  }

  @action updateDocumentTitle({ target: { value: title } }) {
    this.validTitle = Boolean(title);
    this.args.document.title = title;
  }

  @action updateDocumentDescription({ target: { value: description } }) {
    this.args.document.description = description;
  }

  @action resetState() {
    this.editTitle = false;
    this.validTitle = true;
    this.editDescription = false;
  }

  @restartableTask *saveDocument() {
    try {
      yield this.args.document.save();
      this.resetState();
      this.notification.success(this.intl.t("alexandria.success.update"));
    } catch (error) {
      this.notification.danger(this.intl.t("alexandria.errors.update"));
    }
  }

  @dropTask *uploadReplacement(event) {
    try {
      const [file] = event.target.files;
      yield this.documents.replace(this.args.document, file);
    } catch (error) {
      this.notification.danger(
        this.intl.t("alexandria.errors.replace-document")
      );
    }
  }

  // Tags

  @action async didInsertTagSearch(element) {
    this.tagSearchBox = element.querySelector("input");
    await this.tags.fetchAllTags.perform();
  }

  @restartableTask *onSearchTag() {
    yield timeout(500);

    if (!this.tags.allTags || this.tagSearchBox.value === "") {
      this.matchingTags = [];
    } else {
      const searchValue = this.tagSearchBox.value.toLowerCase();
      this.matchingTags = this.tags.allTags.filter((tag) =>
        tag.name.toLowerCase().startsWith(searchValue)
      );
    }
  }

  @task *addTagSuggestion(tag) {
    yield this.tags.add(this.args.document, tag);

    this.tagSearchBox.value = "";
    this.matchingTags = [];
  }

  @task *addTagFromForm(event) {
    event.preventDefault();

    const tag = event.target.elements.tag.value;
    yield this.tags.add(this.args.document, tag);

    this.tagSearchBox.value = "";
    this.matchingTags = [];
  }

  @task *removeTag(tag) {
    yield this.tags.remove(this.args.document, tag);
  }
}
