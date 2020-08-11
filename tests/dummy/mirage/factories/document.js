import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  name: () => faker.commerce.product(),
  description: () => faker.company.catchPhrase(),

  afterCreate(document, server) {
    server.create("tag", { documents: [document] });
  },
});
