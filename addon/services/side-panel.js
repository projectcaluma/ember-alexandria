import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class SidePanelService extends Service {
  @tracked open = true;

  async toggle() {
    this.open = !this.open;
  }
}
