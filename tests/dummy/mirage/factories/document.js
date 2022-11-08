import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

import { setAllLocales } from "./helpers";

export default Factory.extend({
  title: () => setAllLocales(faker.commerce.product()),
  description: () => setAllLocales(faker.company.catchPhrase()),
  createdByUser: "dummy",
  createdByGroup: () => faker.company.name(),
  createdAt: () => faker.date.past(),
  thumbnail: null,

  afterCreate(document, server) {
    document.update({
      tags: server.create("tag"),
    });
  },
});
