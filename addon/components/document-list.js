import Component from "@glimmer/component";

export default class DocumentListComponent extends Component {
  get columnCount() {
    return Object.keys(this.args.columns).length;
  }
}
