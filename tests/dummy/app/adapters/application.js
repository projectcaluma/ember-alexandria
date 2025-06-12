import { service } from "@ember/service";
import JSONAPIAdapter from "@ember-data/adapter/json-api";

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service session;

  namespace = "/api/v1";

  get headers() {
    return this.session.headers;
  }
}
