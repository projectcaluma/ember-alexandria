import { action } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import { findAll } from "ember-data-resources";

import { ErrorHandler } from "ember-alexandria/helpers/error-handler";

export default class MarksService extends Service {
  @service store;

  marks = findAll(this, "mark");

  /**
   * Adds a mark to a document. Returns the added mark
   *
   * @param {Object} document The target document.
   * @param {Object|String} mark Either e mark instance or a name.
   * @returns {Object} The added mark
   */
  @action async add(document, mark) {
    const marks = await document.marks;

    if (marks.find((m) => m.id === mark.id)) {
      return mark;
    }

    marks.push(mark);
    try {
      await document.save();
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.update");
    }

    return mark;
  }

  /**
   * Removes a mark from a document.
   *
   * @param {Object} document The target document.
   * @param {Object|String} mark Either e mark instance or a name.
   */
  @action async remove(document, mark) {
    document.marks = (await document.marks).filter((t) => t !== mark);
    try {
      await document.save();
    } catch (error) {
      new ErrorHandler(this, error).notify("alexandria.errors.update");
    }
  }
}
