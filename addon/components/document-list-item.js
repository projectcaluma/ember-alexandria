import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class DocumentListItemComponent extends Component {
  @service("alexandria-config") config;
  @service router;

  @tracked color = null;
  @tracked iconClass = null;

  constructor(parent, args) {
    super(parent, args);
    this.loadCategoryColor();
    this.loadIconClass();
  }

  async getFiles() {
    const allFiles = (await this.args.document.files) ?? [];
    return allFiles.filter((f) => f.variant === "original");
  }

  async loadCategoryColor() {
    const category = await this.args.document.category;
    this.color = category.color;
  }

  async loadIconClass() {
    const files = await this.getFiles();
    if (files.length > 0) {
      this.iconClass = files[0].fileTypeInfo.icon;
    } else {
      this.iconClass = "file-alt";
    }
  }

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
