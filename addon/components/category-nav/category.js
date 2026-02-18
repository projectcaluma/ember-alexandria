import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";
import { confirm } from "ember-uikit";
import { trackedFunction } from "reactiveweb/function";

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

  documentCount = trackedFunction(this, () => {
    if (!this.args.category.id) {
      return this.store.peekAll("document").length;
    }

    const categoryIds = [this.args.category.id];
    if (this.args.category.children) {
      const childIds = this.args.category.children.map(
        (category) => category.id,
      );
      categoryIds.push(...childIds);
    }

    return this.store
      .peekAll("document")
      .filter((doc) => categoryIds.includes(doc.category.get("id"))).length;
  });

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
    event.stopPropagation();

    if (!this.args.category.id) return;

    this.dragCounter = 0;
    this.isDragOver = false;

    if (
      event.dataTransfer.files.length &&
      !event.dataTransfer.getData("text")
    ) {
      const uploaded = await this.documents.upload(
        this.args.category,
        event.dataTransfer.files,
      );

      this.router.transitionTo(this.router.currentRouteName, {
        queryParams: {
          category: this.args.category.id,
        },
      });

      return uploaded;
    }

    const documentIds = event.dataTransfer.getData("text").split(",");
    const success = await this.documents.move(this.args.category, documentIds);

    const failed = success.filter((i) => i !== true);
    const successCount = success.filter((i) => i === true).length;

    if (failed.length > 0) {
      const permissionDenied = failed.filter((state) => state.error === 403);
      if (permissionDenied.length > 0) {
        await this.copyFailedMoves(permissionDenied, this.args.category);
      }

      if (failed.length > permissionDenied.length) {
        this.notification.danger(
          this.intl.t("alexandria.errors.move-document", {
            count: failed.length - permissionDenied.length,
          }),
        );
      }
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

  async copyFailedMoves(documentInfos, newCategory) {
    const copyConfirmed = await confirm(
      this.intl.t("alexandria.errors.move-failed", {
        count: documentInfos.length,
        documentTitle: documentInfos[0].document.title,
        categoryName: newCategory.name,
      }),
      {
        confirmButtonText: this.intl.t("alexandria.confirm.copy"),
        cancelButtonText: this.intl.t("alexandria.cancel"),
      },
    );

    if (copyConfirmed) {
      const copyStates = await this.documents.copy(
        documentInfos.map((info) => info.document.id),
        newCategory,
      );
      const copyCountSuccess = copyStates.filter((s) => s === true).length;
      const copyCountFailed = copyStates.filter((s) => s !== true).length;
      if (copyCountSuccess > 0) {
        this.router.transitionTo(this.router.currentRouteName, {
          queryParams: {
            category: newCategory.id,
          },
        });
        this.notification.success(
          this.intl.t("alexandria.success.copy-document", {
            count: copyCountSuccess,
          }),
        );
      }
      if (copyCountFailed > 0) {
        this.notification.danger(
          this.intl.t("alexandria.errors.copy-document", {
            count: copyCountFailed,
          }),
        );
      }
    }
  }
}
