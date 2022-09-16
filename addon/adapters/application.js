import { inject as service } from "@ember/service";
import OIDCJSONAPIAdapter from "ember-simple-auth-oidc/adapters/oidc-json-api-adapter";

export default class ApplicationAdapter extends OIDCJSONAPIAdapter {
  @service config;
  @service session;

  get namespace() {
    return this.config.namespace ?? "/api/v1";
  }

  get headers() {
    return this.session.headers;
  }
}
