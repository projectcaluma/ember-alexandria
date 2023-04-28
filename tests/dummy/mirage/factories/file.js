import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

export default Factory.extend({
  createdByUser: "dummy",
  createdByGroup: "dummy-group",
  createdAt: () => faker.date.past(),
  name: () => faker.lorem.word(),
  variant: "original",
  uploadUrl: "/api/v1/file-upload",
  downloadUrl: () => faker.internet.url(),
});
