import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";

export default class DocumentListItemComponent extends Component {
  @service("alexandria-config") config;
  @service router;

  get classes() {
    const classes = ["document-list-item"];

    if (this.args.isSelected) {
      classes.push("document-list-item--selected");
    }

    this.args.document.marks.forEach((mark) => {
      classes.push(`document-list-item--mark-${mark.id}`);
    });

    return classes.join(" ");
  }

  @action
  transitionTo(url, event) {
    event.preventDefault();

    this.router.transitionTo(url);
  }
}
