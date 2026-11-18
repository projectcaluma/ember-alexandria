import { service } from "@ember/service";
import Service from "ember-simple-auth/services/session";

export default class SessionService extends Service {
  @service intl;
  @service("alexandria-config") config;

  get headers() {
    return {
      // Alexandria's dev auth backend uses the token as active group, switch
      // with `?activeGroup=secondary-group` (default `dev-group`)
      authorization: `Bearer ${this.config.activeGroup ?? "dev-group"}`,
      language: this.intl.primaryLocale,
      "accept-language": this.intl.primaryLocale,
    };
  }
}
