import Service, { service } from "@ember/service";
import { waitForPromise } from "@ember/test-waiters";
import { isEmpty } from "@ember/utils";

const CONTENT_TYPE = "application/vnd.api+json";

const cleanObject = (obj) => {
  return Object.entries(obj).reduce((clean, [key, value]) => {
    return {
      ...clean,
      ...(isEmpty(value) ? {} : { [key]: value }),
    };
  }, {});
};

export default class FetchService extends Service {
  @service session;

  async fetch(resource, init = {}) {
    init.headers = cleanObject({
      ...this.session.headers,
      accept: CONTENT_TYPE,
      "content-type": CONTENT_TYPE,
      ...(init.headers || {}),
    });

    const response = await waitForPromise(fetch(resource, init));

    if (!response.ok) {
      if (response.status === 401) {
        return this.session.handleUnauthorized();
      }

      const contentType = response.headers.map["content-type"];
      let body = "";

      if (
        ["application/json", "application/vnd.api+json"].includes(contentType)
      ) {
        body = (await response.json())?.errors;
      } else if (contentType === "text/plain") {
        body = await response.text();
      }

      // throw an error containing a human readable message
      throw new Error(
        `Fetch request to URL ${response.url} returned ${response.status} ${response.statusText}:\n\n${body}`,
        { cause: body },
      );
    }

    return response;
  }
}
