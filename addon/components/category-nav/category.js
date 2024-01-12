import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { dropTask } from "ember-concurrency";

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

  @dropTask
  *onDrop(event) {
    event.preventDefault();

    if (!this.args.category.id) return;

    this.dragCounter = 0;
    this.isDragOver = false;

    const documentIds = event.dataTransfer.getData("text").split(",");

    const success = yield Promise.all(
      documentIds.map(async (id) => {
        const document = this.store.peekRecord("document", id);

        if (document.category.id === this.args.category.id) {
          return true;
        }

        const previousCategory = this.store.peekRecord(
          "category",
          document.category.id,
        );

        try {
          document.category = this.args.category;
          await document.save();
          return true;
        } catch (error) {
          document.category = previousCategory;

          if (error.errors[0].status === "403") {
            this.notification.danger(
              this.intl.t("alexandria.errors.no-permission"),
            );
          }

          return false;
        }
      }),
    );

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
  }
}
