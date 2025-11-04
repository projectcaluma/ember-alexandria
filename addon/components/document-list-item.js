import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { trackedFunction } from "reactiveweb/function";

export default class DocumentListItemComponent extends Component {
  @service("alexandria-config") config;
  @service router;

  iconClass = trackedFunction(this, async () => {
    const latestFile = await this.args.document.latestFile.value;
    return latestFile?.fileTypeInfo.icon ?? "file-alt";
  });

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
  transitionTo({ url, isExternal = false }, event) {
    if (!isExternal) {
      event.preventDefault();

      this.router.transitionTo(url);
    }
  }
}
