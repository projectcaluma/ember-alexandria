import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  createdByGroup: () => faker.company.companyName(),
  createdAt: () => faker.date.past(),
  name: () => faker.lorem.word(),
  type: "original",
  uploadUrl: "/api/v1/file-upload",
  downloadUrl: () => faker.internet.url(),
});
