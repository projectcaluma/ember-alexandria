import JSONSerializer from "@ember-data/serializer/json";

/*
 * If pagination is enabled in the backend, the response format will be changed.
 * The response data will be wrapped in a `results` object.
 * This would need some configurable normalizer functionality to work.
 */
export default class TemplateSerializer extends JSONSerializer {
  // If we don't do this, Ember will interpret the `meta` property in the single
  // response as meta object and omit it from the attributes.
  extractMeta() {}

  // Disable root key serialization since we want to send plain form data
  serializeIntoHash = null;

  serialize(snapshot) {
    const { name, variant, path } = snapshot.attributes();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("variant", variant);
    formData.append("document", snapshot.belongsTo("document").id);

    if (path instanceof File) {
      formData.append("path", path);
    }

    return formData;
  }
}
