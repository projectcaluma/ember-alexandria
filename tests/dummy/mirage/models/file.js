import { Model, hasMany, belongsTo } from "miragejs";

export default Model.extend({
  document: belongsTo(),
  original: belongsTo("file", { inverse: "renderings" }),
  renderings: hasMany("file", { inverse: "original" }),
});
