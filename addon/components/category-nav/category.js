import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CategoryNavCategoryComponent extends Component {
  @service("alexandria-documents") documents;
  @service router;

  @tracked collapseChildren = false;

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
    return this.isOpen && !this.collapseChildren;
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
}
