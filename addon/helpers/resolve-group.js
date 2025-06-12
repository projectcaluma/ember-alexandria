import Helper from "@ember/component/helper";
import { service } from "@ember/service";

export default class ResolveGroupHelper extends Helper {
  @service("alexandria-config") config;

  compute([id]) {
    return this.config.resolveGroup(id);
  }
}
