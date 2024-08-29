import { faker } from "@faker-js/faker";
import { Factory, trait } from "miragejs";

export default Factory.extend({
  title: () => faker.system.commonFileName(),
  description: () => faker.company.catchPhrase(),
  createdByUser: () => faker.person.fullName(),
  createdByGroup: () => faker.company.name(),
  createdAt: () => faker.date.past(),
  thumbnail: null,
  modifiedAt: () => faker.date.past(),
  date: () => (Math.random() >= 0.5 ? faker.date.past() : null),

  afterCreate(document, server) {
    const marks = server.schema.marks.all().models;
    const tags = server.schema.tags.all().models;

    document.update({
      tags: faker.helpers.arrayElements(tags, { min: 0, max: tags.length }),
      marks: faker.helpers.arrayElements(marks, { min: 0, max: marks.length }),
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
