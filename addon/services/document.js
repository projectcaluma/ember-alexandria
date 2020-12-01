import Service, { inject as service } from "@ember/service";
import fetch from "fetch";

export default class DocumentService extends Service {
  @service store;
  @service config;

  /**
   * Uploads one or multipl files and creates the necessary document and
   * files entries on the API.
   *
   * @param {Object|String|Number} category Either an ID or category instance.
   * @param {Array<File>} files The file(s) from input[type=file].
   */
  async upload(category, files) {
    if (!category.id) {
      category =
        (await this.store.peekRecord("category", category)) ||
        this.store.findRecord("category", category);
    }

    await Promise.all(
      Array.from(files).map(async (file) => {
        const documentModel = this.store.createRecord("document", {
          category,
          meta: this.config.defaultModelMeta.document,
        });
        documentModel.title = file.name;
        await documentModel.save();

        const fileModel = this.store.createRecord("file", {
          name: file.name,
          type: "original",
          document: documentModel,
        });
        await fileModel.save();

        const response = await fetch(fileModel.uploadUrl, {
          method: "PUT",
          body: file,
        });

        if (!response.ok) {
          throw new Error(response.statusText, response.status);
        }
      })
    );
  }

  /**
   * Uploads a new version of a file and creates the necessary API entry.
   *
   * @param {Object} document A document instance.
   * @param {File} file The file from input[type=file].
   */
  async replace(document, file) {
    const fileModel = this.store.createRecord("file", {
      name: file.name,
      type: "original",
      document,
    });

    await fileModel.save();

    const response = await fetch(fileModel.uploadUrl, {
      method: "PUT",
      body: file,
    });

    if (!response.ok) {
      throw new Error(response.statusText, response.status);
    }
  }
}
