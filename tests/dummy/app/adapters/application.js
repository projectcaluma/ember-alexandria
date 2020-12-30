import JSONAPIAdapter from "@ember-data/adapter/json-api";

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = "api/v1";

  headers = {
    // This requires two environment variables to be set on the backend:
    // https://github.com/projectcaluma/alexandria#configuration
    // - OIDC_AUTH_BACKEND=alexandria.oidc_auth.authentication.DummyAuthenticationBackend
    // - DEBUG=true
    Authorization: "Bearer DUMMY",
  };
}
