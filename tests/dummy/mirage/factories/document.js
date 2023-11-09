import { faker } from "@faker-js/faker";
import { Factory, trait } from "miragejs";

import { setAllLocales } from "./helpers";

export default Factory.extend({
  title: () => setAllLocales(faker.system.commonFileName()),
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
      marks: [],
    });
  },

  withFiles: trait({
    afterCreate(document, server) {
      server.createList("file", faker.number.int({ min: 1, max: 5 }), {
        document,
      });
    },
  }),
});
