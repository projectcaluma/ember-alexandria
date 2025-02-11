import { faker } from "@faker-js/faker";
import mime from "mime";
import { Factory } from "miragejs";

export default Factory.extend({
  createdByUser: () => faker.person.fullName(),
  createdByGroup: () => faker.company.name(),
  createdAt: () => faker.date.past(),
  name: () => faker.system.fileName(),
  variant: "original",
  downloadUrl: () => faker.internet.url(),

  afterCreate(file) {
    file.update({ mimeType: mime.getType(file.name) });
  },
});
