import { Model, hasMany, belongsTo } from "miragejs";

export default Model.extend({
  category: belongsTo(),
  tags: hasMany(),
  marks: hasMany(),
  files: hasMany(),
});
