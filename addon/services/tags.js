import { action } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import { dasherize } from "@ember/string";
import { tracked } from "@glimmer/tracking";
import { lastValue, task } from "ember-concurrency-decorators";

export default class TagsService extends Service {
  @service store;

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
      filter: { withDocumentsInCategory: this.category },
    });
  }

  /**
   * Adds a tag to a document and creates the tag if necessary.
   *
   * @param {Object} document The target document.
   * @param {Object|String} tag Either e tag instance or a name.
   */
  @action async add(document, tag) {
    if (typeof tag === "string") {
      const existing = this.allTags.findBy("name", tag);

      if (existing) {
        tag = existing;
      } else {
        tag = this.store.createRecord("tag", {
          id: dasherize(tag),
          name: tag,
        });
        await tag.save();
      }
    }

    if (document.tags.findBy("id", tag.id)) {
      return;
    }

    document.tags.pushObject(tag);
    await document.save();

    this.fetchAllTags.perform();
    this.fetchSearchTags.perform();
  }

  /**
   * Removes a tag from a document.
   *
   * @param {Object} document The target document.
   * @param {Object|String} tag Either e tag instance or a name.
   */
  @action async remove(document, tag) {
    if (typeof tag === "string") {
      tag = this.allTags.findBy("name", tag);
    }

    document.tags.removeObject(tag);
    await document.save();

    this.fetchSearchTags.perform();
  }
}
