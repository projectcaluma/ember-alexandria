import { createServer, Response } from "miragejs";

export default function makeServer(config) {
  return createServer({
    ...config,
    trackRequests: true,
    routes() {
      this.urlPrefix = "";
      this.namespace = "/api/v1";
      this.timing = 400;

      this.resource("categories", { only: ["index", "show"] });
      this.resource("documents", { except: ["create"] });
      this.post("/documents", function (schema) {
        return schema.documents.create();
      });
      this.post("/documents/:id/copy", function (schema, request) {
        const originalDocument = schema.documents.find(request.params.id);
        const payload = JSON.parse(request.requestBody || "{}");
        const payloadCategoryId =
          payload?.data?.relationships?.category?.data?.id;
        const category = payloadCategoryId
          ? schema.categories.find(payloadCategoryId)
          : originalDocument.category;

        const input = {
          ...originalDocument.attrs,
        };
        delete input.id;

        return schema.documents.create({
          ...input,
          category,
        });
      });
      this.resource("tags", { except: ["delete"] });
      this.resource("marks", { only: ["index", "show"] });

      this.get("/files/:id");
      this.post("/files", function (schema, request) {
        const attrs = Object.fromEntries(request.requestBody.entries());
        return schema.files.create({
          ...attrs,
          document: schema.documents.find(attrs.document),
        });
      });

      this.get("/files/multi", () => new Response(200, {}, {}));

      this.get("/search", function (schema) {
        const res = schema.searchResults.create({
          document: schema.documents.create(),
        });
        const serialized = this.serialize(res);
        serialized.data = [serialized.data];
        return serialized;
      });
    },
  });
}
