import { action } from "@ember/object";
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
export default class SidePanelService extends Service {
  @tracked open = true;

  /**
   * Toggles the side panel open state
   */
  @action async toggle() {
    this.open = !this.open;
  }
}
