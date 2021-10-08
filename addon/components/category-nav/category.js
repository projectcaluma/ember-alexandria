import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class CategoryNavCategoryComponent extends Component {
  @service documents;
  @service router;

  @action loadCategory() {
    this.documents.clearDocumentSelection();
    this.router.transitionTo({
      queryParams: {
        category: this.args.category.id,
        search: undefined,
        document: undefined,
      },
    });
  }
}
