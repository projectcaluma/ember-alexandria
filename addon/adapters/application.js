import { inject as service } from "@ember/service";
import OIDCJSONAPIAdapter from "ember-simple-auth-oidc/adapters/oidc-json-api-adapter";

// when adding a new adapter, make sure to add it to the test app aswell
export default class ApplicationAdapter extends OIDCJSONAPIAdapter {
  @service("alexandria-config") config;
  @service session;

  get namespace() {
    return this.config.namespace ?? "/api/v1";
  }

  get headers() {
    return this.session.headers;
  }
}
