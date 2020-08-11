import { Factory, trait } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  name: () => faker.lorem.word(),
  description: () => faker.lorem.sentence(),
  color: () =>
    faker.random.arrayElement([
      "#9CDD69",
      "#66CFC9",
      "#8791EC",
      "#CB68C1",
      "#DB8B72",
    ]),

  withDocuments: trait({
    afterCreate(category, server) {
      server.createList("document", 15, { category });
    },
  }),
});
