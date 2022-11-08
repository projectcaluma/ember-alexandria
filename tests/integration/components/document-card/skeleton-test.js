import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | document-card/skeleton", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders skeleton document card", async function (assert) {
    await render(hbs`<DocumentCard::Skeleton @animationDelay="100ms"/>`);

    assert.dom("[data-test-img]").hasStyle({ "animation-delay": "0.1s" });
    assert.dom("[data-test-text]").hasStyle({ "animation-delay": "0.1s" });
    assert
      .dom("[data-test-ellipsis]")
      .hasStyle({ color: "rgb(244, 244, 244)" });
  });
});
