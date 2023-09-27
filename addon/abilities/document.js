import { Ability } from "ember-can";

export default class DocumentAbility extends Ability {
  get can() {
    return true;
  }
}
