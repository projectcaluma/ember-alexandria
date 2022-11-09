import { Model, hasMany, belongsTo } from "miragejs";

export default Model.extend({
  category: belongsTo(),
  tags: hasMany(),
  files: hasMany(),
});
