import { service } from "@ember/service";

export default function (BaseClass) {
  return class DocumentAdapter extends BaseClass {
    @service("alexandria-config") config;

    get namespace() {
      return this.config.namespace ?? "/api/v1";
    }

    ajaxOptions(url, type, options) {
      const ajaxOptions = super.ajaxOptions(url, type, options);

      if (type === "POST") {
        // Remove content type for updating and creating records so the content
        // type will be defined by the passed form data
        delete ajaxOptions.headers["content-type"];
      }

      return ajaxOptions;
    }

    createRecord(store, type, snapshot) {
      const url = this.buildURL(type.modelName, null, snapshot, "createRecord");

      const data = store
        .serializerFor(type.modelName)
        .serializeCreate(snapshot);

      return this.ajax(url, "POST", { data });
    }
  };
}
