import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  createdByUser: "dummy",
  createdByGroup: "dummy-group",
  createdAt: () => faker.date.past(),
  name: () => faker.lorem.word(),
  type: "original",
  uploadUrl: "/api/v1/file-upload",
  downloadUrl: () => faker.internet.url(),
});
