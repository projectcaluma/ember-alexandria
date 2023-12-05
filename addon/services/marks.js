import { action } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import { findAll } from "ember-data-resources";

import { ErrorHandler } from "ember-alexandria/helpers/error-handler";

export default class MarksService extends Service {
  @service store;

  marks = findAll(this, "mark");

  /**
   * Adds a mark to a document.
   *
   * @param {Object} document The target document.
   * @param {Object|String} mark Either e mark instance or a name.
   */
  @action async add(document, mark) {
    const marks = [...(await document.marks)];

    if (marks.find((m) => m.id === mark.id)) {
      return;
    }

    try {
      document.marks = [...marks, mark];
      await document.save();
    } catch (error) {
      document.marks = marks;
      new ErrorHandler(this, error).notify("alexandria.errors.update");
    }
  }

  /**
   * Removes a mark from a document.
   *
   * @param {Object} document The target document.
   * @param {Object|String} mark Either e mark instance or a name.
   */
  @action async remove(document, mark) {
    const marks = [...(await document.marks)];

    if (!marks.find((m) => m.id === mark.id)) {
      return;
    }

    try {
      document.marks = marks.filter((m) => m !== mark);
      await document.save();
    } catch (error) {
      document.marks = marks;
      new ErrorHandler(this, error).notify("alexandria.errors.update");
    }
  }
}
