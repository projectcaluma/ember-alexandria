import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import mime from "mime";

export default class DocumentListItemComponent extends Component {
  @service("alexandria-config") config;
  @service router;

  @tracked mimeType = null;
  @tracked color = null;

  constructor(parent, args) {
    super(parent, args);
    this.loadDocumentMimeType();
    this.loadCategoryColor();
  }

  async loadDocumentMimeType() {
    const allFiles = (await this.args.document.files) ?? [];
    const files = allFiles.filter((f) => f.variant === "original");
    this.mimeType =
      files.length > 0
        ? files[0].mimeType || mime.getType(files[0].name)
        : null;
  }

  async loadCategoryColor() {
    const category = await this.args.document.category;
    this.color = category.color;
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

  get iconClass() {
    if (this.mimeType) {
      const iconConfig = [
        { iconClass: "file-image", mimeTypeParts: ["image/"] },
        { iconClass: "file-pdf", mimeTypeParts: ["application/pdf"] },
        { iconClass: "file-word", mimeTypeParts: ["word"] },
        { iconClass: "file-excel", mimeTypeParts: ["excel", "spreadsheet"] },
        {
          iconClass: "file-powerpoint",
          mimeTypeParts: ["powerpoint", "presentation"],
        },
        {
          iconClass: "envelope",
          mimeTypeParts: ["application/vnd.ms-outlook", "message/rfc822"],
        },
        {
          iconClass: "file",
          mimeTypeParts: [
            "image/vnd.dwg",
            "application/acad",
            "application/x-dwg",
          ],
        },
      ];
      return (
        iconConfig.find((c) =>
          c.mimeTypeParts.some((part) => this.mimeType.includes(part)),
        )?.iconClass || "file-alt"
      );
    }

    return "file-alt";
  }

  @action
  transitionTo({ url, isExternal = false }, event) {
    if (!isExternal) {
      event.preventDefault();

      this.router.transitionTo(url);
    }
  }
}
