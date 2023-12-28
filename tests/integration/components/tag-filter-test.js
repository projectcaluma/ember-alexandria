import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Integration | Component | tag-filter", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.mark = this.server.create("mark");
    this.server.createList("tag", 2);
  });

  test("it renders", async function (assert) {
    await render(hbs`<TagFilter />`);

    assert.dom("button").exists({ count: 2 });
  });

  test("it renders mark filter", async function (assert) {
    this.server.create("document", {
      marks: [this.mark],
    });

    await render(hbs`<TagFilter />`);

    assert.dom("button").exists({ count: 3 });
  });
});
