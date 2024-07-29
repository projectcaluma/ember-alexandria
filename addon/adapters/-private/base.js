import { service } from "@ember/service";

export default function (BaseClass) {
  return class BaseAdapter extends BaseClass {
    @service("alexandria-config") config;

    get namespace() {
      return this.config.namespace ?? "/api/v1";
    }
  };
}
