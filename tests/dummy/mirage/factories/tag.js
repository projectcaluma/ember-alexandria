import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  name: () => faker.lorem.word(),
  description: () => faker.lorem.sentence(),
});
