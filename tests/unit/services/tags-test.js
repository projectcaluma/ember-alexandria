import { setupTest } from "dummy/tests/helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Unit | Service | tags", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test("it exists", function (assert) {
    const service = this.owner.lookup("service:tags");
    assert.ok(service);
  });

  test("it adds existing tags", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    const service = this.owner.lookup("service:tags");
    const store = this.owner.lookup("service:store");

    const document = await store.createRecord("document").save();
    const tag = await store.createRecord("tag", { name: "T1" }).save();

    await service.add(document, tag);

    assert.deepEqual(
      requests.map((request) => request.method),
      [
        "POST", // Create document
        "POST", // Create tag
        "PATCH", // Add tag to document
        "GET", // fetchSearchTags
      ],
    );

    assert.ok((await document.tags).includes(tag));
  });

  test("it adds new tags", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    const service = this.owner.lookup("service:tags");
    const store = this.owner.lookup("service:store");

    const document = await store.createRecord("document").save();
    const tag = "T1";

    await service.add(document, tag);

    assert.deepEqual(
      requests.map((request) => request.method),
      [
        "POST", // Create document
        "GET", // search for existing tag
        "POST", // Create tag
        "PATCH", // Add tag to document
        "GET", // fetchSearchTags
      ],
    );

    assert.ok((await document.tags).find((t) => t.name === tag));
  });

  test("it removes tags", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    const service = this.owner.lookup("service:tags");
    const store = this.owner.lookup("service:store");

    const document = await store.createRecord("document").save();
    const tag = (await document.tags)[0];

    await service.remove(document, tag);

    assert.deepEqual(
      requests.map((request) => request.method),
      [
        "POST", // Create document
        "PATCH", // Remove tag from document
        "GET", // fetchSearchTags
      ],
    );

    assert.notOk((await document.tags).includes(tag));
  });
});
