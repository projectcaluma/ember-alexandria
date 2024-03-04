import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class DocumentCardComponent extends Component {
  @service("alexandria-documents") documents;

  get classes() {
    const classes = [
      "document-card",
      "uk-card",
      "uk-card-body",
      "uk-border-rounded-circular",
      "uk-padding-remove",
    ];

    if (this.args.isSelected) {
      classes.push("document-card--selected");
    }

    this.args.document.marks.forEach((mark) => {
      classes.push(`document-card--mark-${mark.id}`);
    });

    return classes.join(" ");
  }
}
