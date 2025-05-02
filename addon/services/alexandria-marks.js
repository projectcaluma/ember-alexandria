import { action } from "@ember/object";
import Service, { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { findAll } from "ember-data-resources";

import { ErrorHandler } from "ember-alexandria/utils/error-handler";

export default class AlexandriaMarksService extends Service {
  @service store;

  @tracked markUpdates = 0;

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
      this.markUpdates++;
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
      this.markUpdates++;
    } catch (error) {
      document.marks = marks;
      new ErrorHandler(this, error).notify("alexandria.errors.update");
    }
  }
}
