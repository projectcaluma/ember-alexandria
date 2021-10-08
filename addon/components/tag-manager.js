import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { timeout } from "ember-concurrency";
import { restartableTask } from "ember-concurrency-decorators";

export default class TagManagerComponent extends Component {
  @service("tags") tagService;
  @tracked matchingTags = [];
  @tracked tagValue;

  @action async fetchAllTags() {
    await this.tagService.fetchAllTags.perform();
  }

  @restartableTask *onInput(event) {
    yield timeout(500);
    const val = event.target.value.trim();

    if (!val.length) {
      this.tagValue = "";
      this.matchingTags = [];
      return;
    }
    this.tagValue = val;
    this.onSearchTag();
  }

  onSearchTag() {
    if (!this.tagService.allTags) {
      this.matchingTags = [];
    } else {
      const searchValue = this.tagValue.toLowerCase();
      this.matchingTags = this.tagService.allTags.filter((tag) =>
        tag.name.toLowerCase().includes(searchValue)
      );
    }
  }

  @action addTagSuggestion(tag) {
    this.args.documents.forEach((doc) => {
      this.tagService.add(doc, tag);
    });

    this.tagValue = "";
    this.matchingTags = [];
  }

  @action async addTagFromForm(event) {
    event.preventDefault();

    const tag = event.target.elements.tag.value;
    const addedTag = await this.tagService.add(this.args.documents[0], tag); // add the tag to the first document

    if (this.args.documents.length > 1) {
      // now add the returned or created tag to all the other documents
      this.args.documents.forEach((doc) => {
        this.tagService.add(doc, addedTag);
      });
    }

    this.tagValue = "";
    this.matchingTags = [];
  }

  @action removeTag(tag) {
    this.args.documents.forEach((doc) => {
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
      const tags = doc.tags;
      if (tags && tags.length !== 0) {
        tags.forEach((tag) => {
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
      }
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
