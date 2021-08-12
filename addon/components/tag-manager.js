import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { faTransgender } from "@fortawesome/free-solid-svg-icons";
import { tracked } from "@glimmer/tracking";
import { timeout } from "ember-concurrency";
import { restartableTask, task } from "ember-concurrency-decorators";

import DocumentCard from "./document-card";

export default class TagManagerComponent extends DocumentCard {
  @service("tags") tagService;
  @tracked matchingTags = [];

  // @action async didInsertTagSearch(element) {
  @action async fetchAllTags(element) {
    this.tagSearchBox = element.querySelector("input");
    await this.tagService.fetchAllTags.perform();
  }

  @restartableTask *onSearchTag() {
    yield timeout(500);

    if (!this.tagService.allTags || this.tagSearchBox.value === "") {
      this.matchingTags = [];
    } else {
      const searchValue = this.tagSearchBox.value.toLowerCase();
      this.matchingTags = this.tagService.allTags.filter((tag) =>
        tag.name.toLowerCase().startsWith(searchValue)
      );
    }
  }

  @task *addTagSuggestion(tag) {
    yield this.args.documents.forEach(async (doc) => {
      await this.tagService.add(doc, tag);
    });

    this.tagSearchBox.value = "";
    this.matchingTags = [];
  }

  @task *addTagFromForm(event) {
    event.preventDefault();
    faTransgender;

    const tag = event.target.elements.tag.value;
    // TODO: Refactor to allow multiple doc editing
    // yield this.tags.add(this.args.document, tag);
    yield this.args.documents.forEach((doc) => {
      // console.log("🦠 doc:", doc);
      this.tagService.add(doc, tag);
    });

    this.tagSearchBox.value = "";
    this.matchingTags = [];
  }

  @task *removeTag(tag) {
    // TODO: Refactor to allow multiple doc editing
    yield this.args.documents.forEach((doc) => {
      if (doc.tags.includes(tag.emberModel)) {
        this.tagService.remove(doc, tag.emberModel);
      }
    });
  }

  get tags() {
    const tagsToDisplay = [];
    const nrOfSelectedDocs = this.args.documents.length;

    // Produce an array of tags that are on the selected docs
    this.args.documents.forEach((doc) => {
      doc.tags.forEach((tag) => {
        const existingTag = tagsToDisplay.find(
          (t) => t.emberModel.id === tag.id
        );
        if (existingTag) {
          existingTag.nrOfDocs += 1;
        } else {
          tagsToDisplay.push({
            emberModel: tag,
            nrOfDocs: 1,
          });
        }
      });
    });

    // Check which tags are selected by all
    tagsToDisplay.forEach((tag) => {
      if (tag.nrOfDocs === nrOfSelectedDocs) {
        tag.selectedByAll = true;
      }
    });

    return tagsToDisplay;
  }
}
