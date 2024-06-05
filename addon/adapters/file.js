import ApplicationAdapter from "./application";

export default class FileAdapter extends ApplicationAdapter {
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

  // Overwrite and replicate the query function,
  // because ember doesnt pass adapterOptions to urlForQuery
  query(_, type, query, __, options) {
    let url = this.buildURL(type.modelName, null, null, "query", query);

    if (options?.adapterOptions?.customEndpoint) {
      url = `${this.buildURL()}/${options.adapterOptions.customEndpoint}`;
    }

    return this.ajax(url, "GET", { data: query });
  }
}
