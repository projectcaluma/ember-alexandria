import { Model, belongsTo, hasMany } from "miragejs";

export default Model.extend({
  documents: hasMany(),
  parent: belongsTo("category"),
  children: hasMany("category"),
});
