import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | drop/item", function (hooks) {
  setupRenderingTest(hooks, { resolver });

  test("it renders", async function (assert) {
    await render(hbs`<Drop::Item @label="test"/>`);

    assert.dom(this.element).hasText("test");
  });

  test("it renders with block", async function (assert) {
    await render(hbs`
      <Drop::Item>
        test
      </Drop::Item>
    `);

    assert.dom(this.element).hasText("test");
  });
});
