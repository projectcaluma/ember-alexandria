import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

import { setAllLocales } from "./helpers";

export default Factory.extend({
  name: () => setAllLocales(faker.lorem.word()),
  description: () => setAllLocales(faker.lorem.sentence()),
  createdByUser: "dummy",
  createdByGroup: "dummy-group",
});
