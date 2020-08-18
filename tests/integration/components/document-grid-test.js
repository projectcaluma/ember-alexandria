import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import sinon from "sinon";
import engineResolverFor from "ember-engines/test-support/engine-resolver-for";

const modulePrefix = "ember-alexandria";
const resolver = engineResolverFor(modulePrefix);

module("Integration | Component | document-grid", function (hooks) {
  setupRenderingTest(hooks, { resolver });

  test("it renders a document grid", async function (assert) {
    const store = this.owner.lookup("service:store");
    const documents = [
      { id: 1, title: "D1" },
      { id: 2, title: "D2" },
      { id: 3, title: "D3" },
    ];
    store.query = sinon.fake.returns(documents);

    await render(hbs`<DocumentGrid />`);

    assert.ok(store.query.calledOnce, "store query was called once");
    assert.equal(
      store.query.args[0][0],
      "document",
      "store query was called with document as model"
    );
    assert.deepEqual(
      store.query.args[0][1],
      { include: "category,files", filter: {} },
      "store query was called with corect query object"
    );

    assert.dom("[data-test-upload]").exists();
    assert.dom("[data-test-empty]").doesNotExist();
    assert.dom("[data-test-document]").exists({ count: 3 });
    assert.dom("[data-test-document]").doesNotHaveClass("selected");

    assert.dom("[data-test-details]").exists();
    assert.dom("[data-test-details]").hasClass("closed");
  });

  test("it renders an empty document grid", async function (assert) {
    const store = this.owner.lookup("service:store");
    store.query = sinon.fake();

    await render(hbs`<DocumentGrid />`);

    assert.dom("[data-test-upload]").exists();
    assert.dom("[data-test-empty]").exists();
    assert.dom("[data-test-details]").exists();
    assert.dom("[data-test-details]").hasClass("closed");
  });

  test("select document", async function (assert) {
    const store = this.owner.lookup("service:store");
    const documents = [
      { id: 1, title: "D1" },
      { id: 2, title: "D2" },
      { id: 3, title: "D3" },
    ];
    store.query = sinon.fake.returns(documents);
    store.peekRecord = sinon.fake.returns(documents[1]);

    await render(hbs`<DocumentGrid @selectedDocumentId={{2}} />`);

    assert.dom("[data-test-empty]").doesNotExist();
    assert.dom("[data-test-document]").exists({ count: 3 });
    assert
      .dom("div:first-child > [data-test-document-link] > [data-test-document]")
      .doesNotHaveClass("selected");
    assert
      .dom(
        "div:nth-child(2) > [data-test-document-link] > [data-test-document]"
      )
      .hasClass("selected");
    assert
      .dom("div:last-child > [data-test-document-link] > [data-test-document]")
      .doesNotHaveClass("selected");

    assert.dom("[data-test-details]").exists();
    assert.dom("[data-test-details]").doesNotHaveClass("closed");

    assert.ok(store.peekRecord.calledOnce, "store peekRecord was called once");
    assert.equal(
      store.peekRecord.args[0][0],
      "document",
      "store peekRecord was called with document as model"
    );
    assert.equal(
      store.peekRecord.args[0][1],
      documents[1].id,
      "store peekRecord was called with corect document id"
    );
  });

  test("pass filters", async function (assert) {
    const store = this.owner.lookup("service:store");

    store.query = sinon.fake.returns();
    this.filters = { title: "test", description: "bla" };

    await render(hbs`<DocumentGrid @filters={{this.filters}} />`);

    assert.ok(store.query.calledOnce, "store query was called once");
    assert.equal(
      store.query.args[0][0],
      "document",
      "store query was called with document as model"
    );
    assert.deepEqual(
      store.query.args[0][1],
      { include: "category,files", filter: this.filters },
      "store query was called with corect filters passed"
    );
  });
});
