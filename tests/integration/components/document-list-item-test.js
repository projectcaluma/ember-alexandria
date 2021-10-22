import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | document-list-item", function (hooks) {
  setupRenderingTest(hooks, { resolver });
  setupIntl(hooks, "en");
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.document = {
      title: "some document",
      modifiedAt: new Date("December 1, 2000 00:00:00"),
      createdByUser: "some group",
    };
    this.isSelected = false;
    this.onClickDocument = () => {};

    await render(hbs`
      <DocumentListItem
        @document={{this.document}}
        @selectedDocuments={{this.selectedDocuments}}
        @isSelected={{this.isSelected}}
        @onClickDocument={{this.onClickDocument}}
      />
    `);
  });

  test("it renders all the required fields for a document", async function (assert) {
    assert.expect(3);
    assert.dom().includesText("some document");
    assert.dom().includesText("12/01/2000");
    assert.dom().includesText("some group");
  });

  test("it fires the onClickDocument function with the correct parameter", async function (assert) {
    assert.expect(1);
    this.set("onClickDocument", (arg) => {
      assert.equal(arg, this.document);
    });

    await click("[data-test-document-list-item]");
  });
});
