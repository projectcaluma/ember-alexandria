import { action } from "@ember/object";
import Component from "@glimmer/component";
import { wrapGrid } from "animate-css-grid";

export default class DocumentGridComponent extends Component {
  @action scrollIntoView(element, [isSelected] = []) {
    if (isSelected) {
      window.setTimeout(
        () =>
          element.scrollIntoView({
            block: "start",
            inline: "nearest",
            behavior: "smooth",
          }),
        500
      );
    }
  }

  @action setupGridAnimations(element) {
    wrapGrid(element);
  }
}
