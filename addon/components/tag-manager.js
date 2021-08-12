import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { faTransgender } from "@fortawesome/free-solid-svg-icons";
import { tracked } from "@glimmer/tracking";
import { timeout } from "ember-concurrency";
import { restartableTask, dropTask, task } from "ember-concurrency-decorators";

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
    yield this.tagService.add(this.args.document, tag);

    this.tagSearchBox.value = "";
    this.matchingTags = [];
  }

  @task *addTagFromForm(event) {
    event.preventDefault();

    const tag = event.target.elements.tag.value;
    // TODO: Refactor to allow multiple doc editing
    // yield this.tags.add(this.args.document, tag);

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
    const allTagsForSelectedDocs = this.args.documents
      .map((d) => d.tags.toArray()) // all the tags for a document
      .flat()
      .map((t) => t.name); // produces one large array of all tags

    this.args.documents.forEach((doc) => {
      doc.tags.forEach((tag) => {
        tagsToDisplay.push({
          emberModel: tag,
          selectedByAll:
            allTagsForSelectedDocs.filter((t) => t.name === tag.name) ===
            nrOfSelectedDocs,
        });
      });
    });

    return tagsToDisplay;
  }
}
