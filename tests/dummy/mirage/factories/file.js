import { Factory } from "ember-cli-mirage";
import faker from "faker";

import {} from "./helpers";

export default Factory.extend({
  name: () => faker.lorem.word(),
  type: "original",
  uploadUrl: "/api/v1/file-upload",
  downloadUrl: () => faker.internet.url(),
});
