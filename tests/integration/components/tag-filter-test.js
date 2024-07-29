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
    this.tags = this.server.createList("tag", 2);
    this.documents = this.server.createList("document", 2);
  });

  // TODO: mirage relationships are not working
  test.skip("it renders", async function (assert) {
    this.documents[0].update({
      tags: this.tags,
    });

    await render(hbs`<TagFilter @documents={{this.documents}} />`, {
      owner: this.engine,
    });

    assert.dom("button").exists({ count: 2 });
  });

  // TODO: mirage relationships are not working
  test.skip("it renders mark filter", async function (assert) {
    this.documents[0].update({
      marks: [this.mark],
    });

    await render(hbs`<TagFilter @documents={{this.documents}} />`, {
      owner: this.engine,
    });

    assert.dom("button").exists({ count: 1 });
  });
});
