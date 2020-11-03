import { Factory } from "ember-cli-mirage";
import faker from "faker";

import { setAllLocales } from "./helpers";

export default Factory.extend({
  name: () => setAllLocales(faker.lorem.word()),
  description: () => setAllLocales(faker.lorem.sentence()),
});
