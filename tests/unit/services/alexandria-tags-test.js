import { setupTest } from "dummy/tests/helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Unit | Service | alexandria-tags", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test("it exists", function (assert) {
    const service = this.engine.lookup("service:alexandria-tags");
    assert.ok(service);
  });

  test("it adds existing tags", async function (assert) {
    const pretender = this.server.pretender;

    const service = this.engine.lookup("service:alexandria-tags");
    const store = this.owner.lookup("service:store");

    const documentId = this.server.create("document").id;
    const document = await store.findRecord("document", documentId);
    const tagByString = this.server.create("tag", { name: "Tag number two" });
    const tag = this.server.create("tag", { name: "Tag number two" });
    const tagModel = await store.findRecord("tag", tag.id);

    pretender.handledRequests = [];
    await service.add(document, tagModel);

    assert.deepEqual(
      pretender.handledRequests.map((request) => request.method),
      [
        "PATCH", // Add tag to document
      ],
    );
    assert.deepEqual(
      [tag.id],
      (await document.tags).map((tag) => tag.id),
    );

    pretender.handledRequests = [];
    await service.add(document, "Tag number two");
    // Our mirage config doesn't actually support the name filtering.
    // By creating the named tag first, we return this one first in the
    // request.

    assert.deepEqual(
      pretender.handledRequests.map((request) => request.method),
      [
        "GET", // Query tags for existing tag
        "PATCH", // Add tag to document
      ],
    );
    assert.deepEqual(pretender.handledRequests[0].queryParams, {
      "filter[nameExact]": tagByString.name,
    });
    assert.deepEqual(
      [tag.id, tagByString.id],
      (await document.tags).map((tag) => tag.id),
    );
  });

  test("it adds new tags", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    const service = this.engine.lookup("service:alexandria-tags");
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

    const service = this.engine.lookup("service:alexandria-tags");
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
