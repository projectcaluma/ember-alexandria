import { setupTest } from "dummy/tests/helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Unit | Service | alexandria-tags", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test("it exists", function (assert) {
    const service = this.owner.lookup("service:alexandria-tags");
    assert.ok(service);
  });

  test("it adds existing tags", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    const service = this.owner.lookup("service:alexandria-tags");
    const store = this.owner.lookup("service:store");

    const documentId = this.server.create("document").id;
    const document = await store.findRecord("document", documentId);
    const tag = await store.createRecord("tag", { name: "T1" }).save();

    await service.add(document, tag);

    assert.deepEqual(
      requests.map((request) => request.method),
      [
        "GET", // Get document
        "POST", // Create tag
        "PATCH", // Add tag to document
      ],
    );

    assert.ok((await document.tags).includes(tag));
  });

  test("it adds new tags", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    const service = this.owner.lookup("service:alexandria-tags");
    const store = this.owner.lookup("service:store");
    const categoryId = this.server.create("category").id;
    const document = await store
      .createRecord("document", {
        category: await store.findRecord("category", categoryId),
      })
      .save();
    const tag = "T1";

    await service.add(document, tag);

    assert.deepEqual(
      requests.map((request) => request.method),
      [
        "GET", // Get category
        "POST", // Create document
        "GET", // search for existing tag
        "POST", // Create tag
        "PATCH", // Add tag to document
      ],
    );

    assert.ok((await document.tags).find((t) => t.name === tag));
  });

  test("it removes tags", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    const service = this.owner.lookup("service:alexandria-tags");
    const store = this.owner.lookup("service:store");

    const documentId = this.server.create("document").id;
    const document = await store.findRecord("document", documentId);
    const tag = (await document.tags)[0];

    await service.remove(document, tag);

    assert.deepEqual(
      requests.map((request) => request.method),
      [
        "GET", // Get document
        "PATCH", // Remove tag from document
      ],
    );

    assert.notOk((await document.tags).includes(tag));
  });
});
