import { action } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import { dasherize } from "@ember/string";
import { tracked } from "@glimmer/tracking";
import { lastValue, task } from "ember-concurrency";

export default class TagsService extends Service {
  @service store;
  @service config;

  /**
   * Different parts of the application should be able to update the searchTags
   * list as easily as possible. By setting the category on the service the
   * triggering code doesn't need to find the correct query parameter.
   */
  @tracked category = null;

  /**
   * This list is a stop-gap measure for the type-ahead search
   * until the API implements a search field. (STARTSWITH)
   */
  @lastValue("fetchAllTags") allTags;

  /** The searchTags are used in the TagFilter component. */
  @lastValue("fetchSearchTags") searchTags;

  @task *fetchAllTags() {
    return yield this.store.findAll("tag");
  }

  @task *fetchSearchTags() {
    return yield this.store.query("tag", {
      filter: {
        withDocumentsInCategory: this.category,
        withDocumentsMetainfo: JSON.stringify(
          this.config.modelMetaFilters.document,
        ),
      },
    });
  }

  /**
   * Adds a tag to a document and creates the tag if necessary. Returns the added tag
   *
   * @param {Object} document The target document.
   * @param {Object|String} tag Either e tag instance or a name.
   * @returns {Object} addedTag The added tag
   */
  @action async add(document, tagInput) {
    let tag = tagInput;
    if (typeof tagInput === "string") {
      const tagId = dasherize(tagInput.trim());
      const existing = this.allTags.find((tag) => tag.id === tagId);
      if (existing) {
        tag = existing;
      } else {
        tag = this.store.createRecord("tag", {
          id: tagId,
          name: tag,
          createdByGroup: this.config.activeGroup,
          modifiedByGroup: this.config.activeGroup,
        });
        await tag.save();
      }
    }

    const tags = await document.tags;

    if (tags.find((t) => t.id === tag.id)) {
      return tag;
    }

    tags.push(tag);
    await document.save();

    await Promise.all([
      this.fetchAllTags.perform(),
      this.fetchSearchTags.perform(),
    ]);

    return tag;
  }

  /**
   * Removes a tag from a document.
   *
   * @param {Object} document The target document.
   * @param {Object|String} tag Either e tag instance or a name.
   */
  @action async remove(document, tag) {
    if (typeof tag === "string") {
      tag = this.allTags.find((t) => t.name === tag);
    }

    document.tags = (await document.tags).filter((t) => t !== tag);
    await document.save();

    this.fetchSearchTags.perform();
  }
}
