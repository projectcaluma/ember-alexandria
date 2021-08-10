import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | document-list", function (hooks) {
  setupRenderingTest(hooks, { resolver });
  setupIntl(hooks, "en");
  setupMirage(hooks);

  test.todo("it renders the list item component with the correct props");
  test.todo("it sets the sort keys correctly");
  test.todo("it selects a clicked row");
  test.todo("it selects mutliple rows if clicked with ctrl");
  test.todo("it selects all rows between two rows clicked with shift");
});
