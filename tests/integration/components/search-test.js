import { render, fillIn, click } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";
import { fake, stub } from "sinon";

module("Integration | Component | search", function (hooks) {
  setupRenderingTest(hooks);

  test("it searches", async function (assert) {
    const router = this.engine.lookup("service:router");

    stub(router, "currentRouteName").get(() => null);
    router.transitionTo = fake();

    await render(hbs`<Search @search="test"/>`, { owner: this.engine });

    assert.dom("[data-test-search-input]").hasValue("test");

    await fillIn("[data-test-search-input]", "new search");

    assert.ok(router.transitionTo.called, "transitionTo was called");
    assert.deepEqual(
      router.transitionTo.firstCall.args,
      [
        null,
        {
          queryParams: { search: "new search" },
        },
      ],
      "transitionTo was called with the correct arguments",
    );
  });

  test("it clears search", async function (assert) {
    const router = this.engine.lookup("service:router");

    stub(router, "currentRouteName").get(() => null);
    router.transitionTo = fake();

    await render(hbs`<Search @search="test"/>`, { owner: this.engine });

    assert.dom("[data-test-search-input]").hasValue("test");

    await click("[data-test-search-clear]");

    assert.ok(router.transitionTo.called, "transitionTo was called");
    assert.deepEqual(
      router.transitionTo.firstCall.args,
      [
        null,
        {
          queryParams: { search: undefined },
        },
      ],
      "transitionTo was called with the correct arguments",
    );
  });
});
