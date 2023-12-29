import { action } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import { dasherize } from "@ember/string";
import { tracked } from "@glimmer/tracking";

import { ErrorHandler } from "ember-alexandria/helpers/error-handler";

export default class TagsService extends Service {
  @service store;
  @service config;

  @tracked categoryCache;

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
      tag = this.store.peekRecord("tag", tag);
    }

    document.tags = (await document.tags).filter((t) => t !== tag);

    try {
      await document.save();
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.update");
    }
  }
}
