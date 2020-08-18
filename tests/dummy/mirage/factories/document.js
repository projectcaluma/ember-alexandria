import { Factory } from "ember-cli-mirage";
import faker from "faker";

import { setAllLocales } from "./helpers";

export default Factory.extend({
  title: () => setAllLocales(faker.commerce.product()),
  description: () => setAllLocales(faker.company.catchPhrase()),
  createdByUser: () => `${faker.name.firstName()} ${faker.name.lastName()}`,
  createdByGroup: () => faker.company.companyName(),
  createdAt: () => faker.date.past(),

  afterCreate(document, server) {
    server.create("tag", { documents: [document] });
  },
});
