import { service } from "@ember/service";
import Component from "@glimmer/component";
export default class MarkManagerComponent extends Component {
  @service("alexandria-marks") marks;

  get documents() {
    return this.args.documents.filter((document) => !document.isDeleted);
  }

  // Marks allowed in the categories of all documents, set marks stay visible
  // so they can be removed
  get availableMarks() {
    return (this.marks.marks.records ?? []).filter(
      (mark) =>
        this.documents.every((document) =>
          mark.allowsCategory(document.belongsTo("category").value()),
        ) ||
        this.documents.some((document) =>
          document.hasMany("marks").ids().includes(mark.id),
        ),
    );
  }
}
