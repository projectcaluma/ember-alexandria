import { service } from "@ember/service";
import Service from "ember-simple-auth/services/session";

export default class SessionService extends Service {
  @service intl;

  get headers() {
    return {
      language: this.intl.primaryLocale,
      "accept-language": this.intl.primaryLocale,
    };
  }
}
