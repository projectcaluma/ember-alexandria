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
      this.get("/search", () => []);
    },
  });
}
