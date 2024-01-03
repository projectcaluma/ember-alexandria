import Helper from "@ember/component/helper";
import { inject as service } from "@ember/service";

export default class ResolveUserHelper extends Helper {
  @service("alexandria-config") config;

  compute([id]) {
    return this.config.resolveUser(id);
  }
}
