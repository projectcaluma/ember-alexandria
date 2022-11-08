/* eslint-disable import/no-named-as-default-member */
import { render, fillIn } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";
import sinon from "sinon";

module("Integration | Component | search", function (hooks) {
  setupRenderingTest(hooks);

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
