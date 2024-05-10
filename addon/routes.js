import buildRoutes from "ember-engines/routes";

export default buildRoutes(function () {
  this.route("index", { path: "/" });
  this.route("search");
  this.route("notfound", { path: "/*path" });
});
