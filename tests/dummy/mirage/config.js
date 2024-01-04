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
      this.resource("documents");
      this.resource("tags", { except: ["delete"] });
      this.resource("marks", { only: ["index"] });

      this.post("/files", function (schema) {
        const attrs = this.normalizedRequestAttrs();
        return schema.files.create({
          ...attrs,
          uploadUrl: "/api/v1/file-upload",
        });
      });

      this.put("/file-upload", () => new Response(201, {}, {}));

      this.get("/files/multi", 200);
    },
  });
}
