import { action } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import { dasherize } from "@ember/string";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";

import { ErrorHandler } from "ember-alexandria/helpers/error-handler";

export default class TagsService extends Service {
  @service store;
  @service config;

  /**
   * Different parts of the application should be able to update the searchTags
   * list as easily as possible. By setting the category on the service the
   * triggering code doesn't need to find the correct query parameter.
   */
  @tracked category = null;

  /** The searchTags are used in the TagFilter component. */
  get searchTags() {
    const allTags = this.fetchSearchTags.lastSuccessful?.value ?? [];

    return allTags
      .map((tag) => {
        if (this.config.markTypes.includes(tag.name)) {
          const mark = this.config.marks.find((m) => m.type === tag.name);

          tag = {
            id: tag.id,
            ...mark,
            isMark: true,
          };
        }

        return tag;
      })
      .sort(function (x, y) {
        // order marks to the front
        return Number(y.isMark ?? 0) - Number(x.isMark ?? 0);
      });
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
    try {
      if (typeof tagInput === "string") {
        const tagId = dasherize(tagInput.trim());
        const existing = (
          await this.store.query("tag", {
            filter: { nameExact: tagId },
          })
        )[0];

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
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.update");
    }

    await this.fetchSearchTags.perform();

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
      tag = this.store.peekRecord("tag", tag.id);
    }

    document.tags = (await document.tags).filter((t) => t !== tag);

    try {
      await document.save();
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.update");
    }

    this.fetchSearchTags.perform();
  }
}
