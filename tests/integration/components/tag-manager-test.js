import { render, click, fillIn } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, todo } from "qunit";

module("Integration | Component | tag-manager", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.tag = this.server.create("tag");
    this.documents = this.server.createList("document", 1);
  });

  // TODO: mirage relationships are not working
  todo("it adds new tag", async function (assert) {
    await render(hbs`<TagManager @documents={{this.documents}} />`);

    await fillIn("[data-test-tag-input]", "new tag");
    await click("[data-test-tag-add]");

    assert.dom(".tag").exists({ count: 1 });
    assert.dom(".tag").hasText("new tag");
  });

  // TODO: mirage relationships are not working
  todo("it adds existing tag", async function (assert) {
    await render(hbs`<TagManager @documents={{this.documents}} />`);

    await fillIn("[data-test-tag-input]", "new tag");
    await click(`[data-test-tag-existing=${this.tag.id}]`);

    assert.dom(".tag").exists({ count: 1 });
    assert.dom(".tag").hasText("new tag");
  });

  // TODO: mirage relationships are not working
  todo("it removes tag", async function (assert) {
    this.documents[0].update({ tags: [this.tag] });

    await render(hbs`<TagManager @documents={{this.documents}} />`);

    assert.dom(".tag").exists({ count: 1 });
    assert.dom(".tag").hasText("new tag");

    await click(`[data-test-tag=${this.tag.id}] button`);

    assert.dom(".tag").exists({ count: 0 });
  });
});
