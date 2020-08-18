import { render, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import sinon from "sinon";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | search", function (hooks) {
  setupRenderingTest(hooks, { resolver });

  test("it renders", async function (assert) {
    const router = this.owner.lookup("service:router");
    router.transitionTo = sinon.fake();

    await render(hbs`<Search @search="test"/>`);

    assert.dom("[data-test-search-input]").hasValue("test");

    await fillIn("[data-test-search-input]", "new search");

    assert.ok(router.transitionTo.called, "transitionTo was called");
    assert.deepEqual(
      router.transitionTo.firstCall.args,
      [
        {
          queryParams: { search: "new search", category: undefined },
        },
      ],
      "transitionTo was called with the correct arguments"
    );
  });
});
