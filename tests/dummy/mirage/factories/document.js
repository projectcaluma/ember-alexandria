import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

import { setAllLocales } from "./helpers";

export default Factory.extend({
  title: () => setAllLocales(faker.commerce.product()),
  description: () => setAllLocales(faker.company.catchPhrase()),
  createdByUser: () => faker.person.fullName(),
  createdByGroup: () => faker.company.name(),
  createdAt: () => faker.date.past(),
  thumbnail: null,
  modifiedAt: () => faker.date.past(),
  date: () => (Math.random() >= 0.5 ? faker.date.past() : null),

  afterCreate(document, server) {
    document.update({
      tags: server.create("tag"),
    });
  },
});
