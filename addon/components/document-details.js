import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { dasherize } from "@ember/string";
import { tracked } from "@glimmer/tracking";
import { restartableTask, dropTask, task } from "ember-concurrency-decorators";

import DocumentCard from "./document-card";

export default class DocumentDetailsComponent extends DocumentCard {
  @service router;
  @service store;

  @tracked editTitle = false;
  @tracked validTitle = true;
  @tracked availableTags;
  @tracked matchingTags;

  @action closePanel() {
    this.router.transitionTo({ queryParams: { document: undefined } });
  }

  @action updateDocumentTitle({ target: { value: title } }) {
    this.validTitle = Boolean(title);
    this.args.document.title = title;
  }

  @action resetState() {
    this.editTitle = false;
    this.validTitle = true;
  }

  @restartableTask *saveDocument() {
    try {
      yield this.args.document.save();
      this.editTitle = false;
      this.notification.success(this.intl.t("alexandria.success.update"));
    } catch (error) {
      this.notification.danger(this.intl.t("alexandria.errors.update"));
    }
  }

  @dropTask *uploadReplacement(event) {
    try {
      const [file] = event.target.files;

      const fileModel = this.store.createRecord("file", {
        name: file.name,
        type: "original",
        document: this.args.document,
      });

      yield fileModel.save();

      const response = yield fetch(fileModel.uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (!response.ok) {
        throw new Error("The request returned an error status code");
      }
    } catch (error) {
      this.notification.danger(
        this.intl.t("alexandria.errors.replace-document")
      );
    }
  }

  @action async didInsertTagSearch(element) {
    this.tagSearchBox = element.querySelector("input");

    const allTags = await this.store.findAll("tag");
    this.availableTags = allTags.rejectBy("name", undefined);
  }

  @action onSearchTag() {
    if (!this.availableTags || this.tagSearchBox.value === "") {
      this.matchingTags = [];
    } else {
      this.matchingTags = this.availableTags.filter((tag) =>
        tag.name.toLowerCase().startsWith(this.tagSearchBox.value.toLowerCase())
      );
    }
  }

  @task *addTagSuggestion(tag) {
    const { tags } = this.args.document;

    this.tagSearchBox.value = "";
    this.matchingTags = [];

    if (tags.findBy("id", tag.id)) {
      return;
    }

    tags.pushObject(tag);

    yield this.args.document.save();
  }

  @task *addTagFromForm(event) {
    event.preventDefault();

    const form = event.target;
    const tag = form.elements.tag.value;

    const existing = this.availableTags.findBy("name", tag);
    const attached = this.args.document.tags;

    this.tagSearchBox.value = "";
    this.matchingTags = [];

    if (attached.findBy("name", tag)) {
      return;
    }

    if (existing) {
      attached.pushObject(existing);
    } else {
      const fresh = this.store.createRecord("tag");
      fresh.id = dasherize(tag);
      fresh.name = { en: tag };

      yield fresh.save();

      attached.pushObject(fresh);
    }

    yield this.args.document.save();
  }

  @task *removeTag(tag) {
    this.args.document.tags.removeObject(tag);
    yield this.args.document.save();
  }
}
