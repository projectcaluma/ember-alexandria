/*eslint-disable ember/no-get */
export default function () {
  this.urlPrefix = "";
  this.namespace = "/api/v1";
  this.timing = 400;

  this.get("/categories");
  this.get("/categories/:id");

  this.get("/documents");
  this.get("/documents/:id");

  this.get("/tags");
  this.get("/tags/:id");
}
