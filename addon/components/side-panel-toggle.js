import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class SidePanelToggleComponent extends Component {
  @service sidePanel;
}
