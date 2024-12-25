import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

export default Factory.extend({
  createdByUser: () => faker.person.fullName(),
  createdByGroup: () => faker.company.name(),
  createdAt: () => faker.date.past(),
  name: () => faker.system.fileName(),
  variant: "original",
  downloadUrl: () => faker.internet.url(),
});
