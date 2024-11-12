import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";

export default class CategoryNavCategoryComponent extends Component {
  @service("alexandria-documents") documents;
  @service notification;
  @service router;
  @service store;
  @service intl;

  dragCounter = 0;

  @tracked collapseChildren = false;
  @tracked isDragOver = false;

  get isActive() {
    if (!this.args.category.id) {
      return this.args.selected === undefined;
    }

    return this.args.selected === this.args.category.id;
  }

  get isOpen() {
    return (
      this.args.category.children
        ?.map((category) => category.id)
        .includes(this.args.selected) || this.isActive
    );
  }

  get expandChildren() {
    return this.isDragOver || (this.isOpen && !this.collapseChildren);
  }

  get controllerInstance() {
    const applicationInstance = getOwner(this);
    return applicationInstance.lookup("controller:application");
  }

  @action loadCategory() {
    if (this.isActive) {
      this.collapseChildren = !this.collapseChildren;
      return;
    }

    this.documents.clearDocumentSelection();
    this.router.transitionTo(this.router.currentRouteName, {
      queryParams: {
        category: this.args.category.id,
        search: undefined,
        document: undefined,
        tags: [],
        marks: [],
      },
    });
  }

  @action onDragEnter() {
    if (!this.args.category.id) return;

    this.dragCounter++;
    this.isDragOver = true;
  }

  @action onDragLeave() {
    if (!this.args.category.id) return;

    this.dragCounter--;
    this.isDragOver = this.dragCounter > 0;
  }

  @action onDragOver(event) {
    if (!this.args.category.id) return;

    event.preventDefault();
    event.stopPropagation();
  }

  onDrop = task({ drop: true }, async (event) => {
    event.preventDefault();

    if (!this.args.category.id) return;

    this.dragCounter = 0;
    this.isDragOver = false;

    if (
      event.dataTransfer.files.length &&
      !event.dataTransfer.getData("text")
    ) {
      return await this.documents.upload(
        this.args.category,
        event.dataTransfer.files,
      );
    }

    const documentIds = event.dataTransfer.getData("text").split(",");
    const success = await this.documents.move(this.args.category, documentIds);

    const failCount = success.filter((i) => i === false).length;
    const successCount = success.filter((i) => i === true).length;

    if (failCount) {
      this.notification.danger(
        this.intl.t("alexandria.errors.move-document", {
          count: failCount,
        }),
      );
    }

    if (successCount) {
      this.notification.success(
        this.intl.t("alexandria.success.move-document", {
          count: successCount,
        }),
      );

      this.router.transitionTo(this.router.currentRouteName, {
        queryParams: {
          category: this.args.category.id,
          search: undefined,
          document: documentIds.join(","),
          tags: [],
          marks: [],
        },
      });
    }
  });
}
