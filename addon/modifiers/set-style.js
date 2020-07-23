import { modifier } from "ember-modifier";

export default modifier(function setStyle(element, _, styles) {
  Object.entries(styles).forEach(([key, value]) => {
    element.style[key] = value;
  });
});
