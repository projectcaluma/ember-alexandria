import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import mime from "mime";

export default class DocumentListItemComponent extends Component {
  @service("alexandria-config") config;
  @service router;

  @tracked mimeType = null;

  constructor(parent, args) {
    super(parent, args);
    this.loadDocumentMimeType();
  }

  async loadDocumentMimeType() {
    const allFiles = (await this.args.document.files) ?? [];
    const files = allFiles.filter((f) => f.variant === "original");
    this.mimeType =
      files.length > 0
        ? files[0].mimeType || mime.getType(files[0].name)
        : null;
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

  get iconStyle() {
    let iconClass = "file-alt";
    let color = "#6c757d";

    if (this.mimeType) {
      if (this.mimeType.startsWith("image/")) {
        iconClass = "file-image";
        color = "#28a745";
      } else if (this.mimeType === "application/pdf") {
        iconClass = "file-pdf";
        color = "#dc3545";
      } else if (
        this.mimeType.includes("word") ||
        [
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
        ].includes(this.mimeType)
      ) {
        iconClass = "file-word";
        color = "#2b579a";
      } else if (
        this.mimeType.includes("excel") ||
        this.mimeType.includes("spreadsheet") ||
        [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ].includes(this.mimeType)
      ) {
        iconClass = "file-excel";
        color = "#217346";
      } else if (
        this.mimeType.includes("powerpoint") ||
        this.mimeType.includes("presentation") ||
        this.mimeType ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        this.mimeType === "application/vnd.ms-powerpoint"
      ) {
        iconClass = "file-powerpoint";
        color = "#d24726";
      } else if (
        this.mimeType === "application/vnd.ms-outlook" ||
        this.mimeType === "message/rfc822"
      ) {
        iconClass = "envelope";
        color = "#0078d4";
      } else if (
        ["image/vnd.dwg", "application/acad", "application/x-dwg"].includes(
          this.mimeType,
        )
      ) {
        iconClass = "file";
        color = "#ffc107";
      }
    }

    return {
      iconClass,
      color,
    };
  }

  @action
  transitionTo({ url, isExternal = false }, event) {
    if (!isExternal) {
      event.preventDefault();

      this.router.transitionTo(url);
    }
  }
}
