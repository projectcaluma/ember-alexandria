import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { task } from "ember-concurrency";
import { query } from "ember-data-resources";

export default class DocumentUploadButtonComponent extends Component {
  @service notification;
  @service intl;
  @service store;
  @service("alexandria-documents") documents;

  categories = query(this, "category", () => ({
    "filter[hasParent]": false,
    include: "children",
  }));

  get category() {
    return this.store.peekRecord("category", this.args.categoryId);
  }

  upload = task(async (category, { target: { files = [] } = {} }) => {
    await this.documents.upload(category, files);

    if (this.args.afterUpload) {
      this.args.afterUpload();
    }
  });
}
