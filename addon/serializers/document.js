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
}
