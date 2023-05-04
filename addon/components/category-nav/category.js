import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class CategoryNavCategoryComponent extends Component {
  @service documents;
  @service router;

  get controllerInstance() {
    const applicationInstance = getOwner(this);
    return applicationInstance.lookup("controller:application");
  }

  @action loadCategory() {
    this.documents.clearDocumentSelection();
    this.controllerInstance.resetTagFilter();
    this.router.transitionTo(this.router.currentRouteName, {
      queryParams: {
        category: this.args.category.id,
        search: undefined,
        document: undefined,
        tags: undefined,
      },
    });
  }
}
