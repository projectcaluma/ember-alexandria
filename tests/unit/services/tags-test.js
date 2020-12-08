import { setupMirage } from "ember-cli-mirage/test-support";
import { setupTest } from "ember-qunit";
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

    await service.fetchAllTags.perform();

    const document = await store.createRecord("document").save();
    const tag = await store.createRecord("tag", { name: "T1" }).save();

    await service.add(document, tag);

    assert.deepEqual(
      requests.map((request) => request.method),
      [
        "GET", // fetchAllTags
        "POST", // Create document
        "POST", // Create tag
        "PATCH", // Add tag to document
        "GET", // fetchAllTags
        "GET", // fetchSearchTags
      ]
    );

    assert.ok(document.tags.includes(tag));
  });

  test("it adds new tags", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    const service = this.owner.lookup("service:tags");
    const store = this.owner.lookup("service:store");

    await service.fetchAllTags.perform();

    const document = await store.createRecord("document").save();
    const tag = "T1";

    await service.add(document, tag);

    assert.deepEqual(
      requests.map((request) => request.method),
      [
        "GET", // fetchAllTags
        "POST", // Create document
        "POST", // Create tag
        "PATCH", // Add tag to document
        "GET", // fetchAllTags
        "GET", // fetchSearchTags
      ]
    );

    assert.ok(document.tags.findBy("name", tag));
  });

  test("it removes tags", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    const service = this.owner.lookup("service:tags");
    const store = this.owner.lookup("service:store");

    await service.fetchAllTags.perform();

    const document = await store.createRecord("document").save();
    const tag = document.tags.firstObject;

    await service.remove(document, tag);

    assert.deepEqual(
      requests.map((request) => request.method),
      [
        "GET", // fetchAllTags
        "POST", // Create document
        "PATCH", // Remove tag from document
        "GET", // fetchSearchTags
      ]
    );

    assert.notOk(document.tags.includes(tag));
  });
});
