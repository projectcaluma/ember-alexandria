import { service } from "@ember/service";
import Component from "@glimmer/component";
export default class DocumentsSidePanelComponent extends Component {
  @service("alexandria-side-panel") sidePanel;
}
