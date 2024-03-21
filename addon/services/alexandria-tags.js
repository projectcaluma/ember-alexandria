import { action } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import { dasherize } from "@ember/string";
import { tracked } from "@glimmer/tracking";

import { ErrorHandler } from "ember-alexandria/utils/error-handler";

export default class AlexandriaTagsService extends Service {
  @service store;
  @service("alexandria-config") config;

  // Needed to trigger a recompute of the tag-filter
  @tracked tagUpdates = 0;

  /**
   * Adds a tag to a document and creates the tag if necessary. Returns the added tag
   *
   * @param {Object} document The target document.
   * @param {Object|String} tag Either e tag instance or a name.
   * @returns {Object} addedTag The added tag
   */
  @action async add(document, tagInput) {
    let tag = tagInput;
    const tags = [...(await document.tags)];

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

      if (tags.find((t) => t.id === tag.id)) {
        return tag;
      }

      document.tags = [...tags, tag];
      await document.save();
      this.tagUpdates++;
    } catch (error) {
      document.tags = tags;
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

    const tags = [...(await document.tags)];

    document.tags = tags.filter((t) => t !== tag);

    try {
      await document.save();
      this.tagUpdates++;
    } catch (error) {
      document.tags = tags;
      new ErrorHandler(this, error).notify("alexandria.errors.update");
    }
  }
}
