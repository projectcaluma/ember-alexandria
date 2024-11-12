import { faker } from "@faker-js/faker";
import { Factory, trait } from "miragejs";

import { setAllLocales } from "./helpers";

export default Factory.extend({
  name: () => setAllLocales(faker.lorem.word()),
  description: () => setAllLocales(faker.lorem.sentence()),
  color: () =>
    faker.helpers.arrayElement([
      "#9CDD69",
      "#66CFC9",
      "#8791EC",
      "#CB68C1",
      "#DB8B72",
    ]),
  allowedMimeTypes: () => [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/gif",
    "text/plain",
  ],

  withDocuments: trait({
    afterCreate(category, server) {
      server.createList("document", 2, { category }, "withFiles");
    },
  }),
});
