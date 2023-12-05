import Component from "@glimmer/component";

export default class DocumentListItemComponent extends Component {
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
}
