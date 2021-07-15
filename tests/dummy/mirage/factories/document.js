import { Factory } from "ember-cli-mirage";
import faker from "faker";

import { setAllLocales } from "./helpers";

export default Factory.extend({
  title: () => setAllLocales(faker.commerce.product()),
  description: () => setAllLocales(faker.company.catchPhrase()),
  createdByUser: "dummy",
  createdByGroup: () => faker.company.companyName(),
  createdAt: () => faker.date.past(),
  thumbnail: null,

  afterCreate(document, server) {
    server.create("tag", { documents: [document] });
  },
});
