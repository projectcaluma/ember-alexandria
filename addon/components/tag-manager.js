import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { timeout, restartableTask } from "ember-concurrency";
import { trackedFunction } from "ember-resources/util/function";

export default class TagManagerComponent extends Component {
  @service("tags") tagService;
  @service config;
  @service store;

  @tracked tagValue;

  suggestedTags = trackedFunction(this, async () => {
    if (!this.tagValue) {
      return [];
    }

    return await this.store.query("tag", {
      filter: {
        search: this.tagValue,
        ...this.config.suggestedTagsFilters,
      },
      page: { size: 20 },
    });
  });

  get controllerInstance() {
    const applicationInstance = getOwner(this);
    return applicationInstance.lookup("controller:application");
  }

  @restartableTask *onInput(event) {
    yield timeout(500);
    const val = event.target.value.trim();

    if (!val.length) {
      this.tagValue = "";
      return;
    }
    this.tagValue = val;
  }

  @action addTagSuggestion(tag) {
    this.args.documents.forEach((doc) => {
      this.tagService.add(doc, tag);
    });

    this.tagValue = "";
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
  }

  @action removeTag(tag) {
    this.controllerInstance.removeTagFromTags(tag.emberModel.name);
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
          if (this.config.markTypes.includes(tag.name)) {
            return;
          }

          const existingTag = tagsToDisplay.find(
            (t) => t.emberModel.id === tag.id,
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
