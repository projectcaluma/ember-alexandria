import Route from "@ember/routing/route";
import { service } from "@ember/service";

export default class ApplicationRoute extends Route {
  @service intl;
  @service session;

  async beforeModel() {
    await this.session.setup();
  }

  afterModel() {
    this.intl.setLocale("en");
  }
}
