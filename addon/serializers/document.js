import { LocalizedSerializer } from "ember-localized-model";

export default class DocumentSerializer extends LocalizedSerializer {
  serializeCreate(snapshot) {
    const data = snapshot.attributes();
    const content = data.content;
    delete data.content;
    data.category = snapshot.belongsTo("category").id;

    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(data)], {
        type: "application/vnd.api+json",
      }),
    );
    formData.append("content", content);

    return formData;
  }

  serialize(...args) {
    const json = super.serialize(...args);

    // delete content attribute, as it is only needed for POST
    delete json.data.attributes.content;

    return json;
  }
}
