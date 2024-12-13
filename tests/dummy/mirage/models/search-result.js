import { Model, belongsTo } from "miragejs";

export default Model.extend({
  document: belongsTo(),
  matchedFile: belongsTo(),
});
