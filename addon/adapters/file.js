import { service } from "@ember/service";

export default function (BaseClass) {
  return class FileAdapter extends BaseClass {
    @service("alexandria-config") config;

    get namespace() {
      return this.config.namespace ?? "/api/v1";
    }

    ajaxOptions(url, type, options) {
      const ajaxOptions = super.ajaxOptions(url, type, options);

      if (type === "PUT") {
        // Use PATCH instead of PUT for updating records
        ajaxOptions.type = "PATCH";
        ajaxOptions.method = "PATCH";
      }

      if (type === "PUT" || type === "POST") {
        // Remove content type for updating and creating records so the content
        // type will be defined by the passed form data
        delete ajaxOptions.headers["content-type"];
      }

      return ajaxOptions;
    }
  };
}
