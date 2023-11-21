import ApplicationAdapter from "./application";

export default class FileAdapter extends ApplicationAdapter {
  ajaxOptions(url, type, options) {
    console.log(url, type, options);
    const ajaxOptions = super.ajaxOptions(url, type, options);

    if (type === "PUT") {
      // Use PATCH instead of PUT for updating records
      ajaxOptions.type = "PATCH";
      ajaxOptions.method = "PATCH";
    }

    if (type === "PUT" || type === "POST") {
      // Remove content type for updating and creating records so the content
      // type will be defined by the passed form data
      console.log("removing content-type header from", ajaxOptions.headers);
      delete ajaxOptions.headers["content-type"];
    }

    return ajaxOptions;
  }
}
