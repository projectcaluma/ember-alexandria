import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

export default Factory.extend({
  fileName: () => faker.system.fileName(),
  documentName: () => faker.system.fileName(),
  searchRank: () => faker.number.int(),
  searchContext: () => faker.word.adjective(),

  afterCreate(result, server) {
    result.update({
      document: server.schema.documents.create(),
      matchedFile: server.schema.files.create(),
    });
  },
});
