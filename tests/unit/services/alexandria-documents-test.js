import { setupTest } from "dummy/tests/helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Unit | Service | alexandria-documents", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test("it exists", function (assert) {
    const service = this.owner.lookup("service:alexandria-documents");
    assert.ok(service);
  });

  test("it uploads documents", async function (assert) {
    const service = this.owner.lookup("service:alexandria-documents");
    const store = this.owner.lookup("service:store");

    const category = await store.findRecord(
      "category",
      this.server.create("category").id,
    );
    const files = [
      new File(["1"], "test1.docx"),
      new File(["2"], "test2.docx"),
      new File(["3"], "test3.docx"),
    ];

    await service.upload(category, files);

    const requests = this.server.pretender.handledRequests.filter(
      (request) => !request.url.includes("categories"),
    );

    // Each file generates three requests.
    assert.strictEqual(requests.length, files.length * 2);

    // Files will be uploaded in parallel. So, we cannot know the order.
    const documentRequests = requests.filter((request) =>
      request.url.endsWith("documents"),
    );
    const fileRequests = requests.filter((request) =>
      request.url.endsWith("files"),
    );

    assert.strictEqual(documentRequests.length, files.length);
    assert.strictEqual(fileRequests.length, files.length);
  });

  test("it replaces documents", async function (assert) {
    const service = this.owner.lookup("service:alexandria-documents");
    const store = this.owner.lookup("service:store");

    const document = await store.findRecord(
      "document",
      this.server.create("document").id,
    );
    const file = new File([""], "test.docx");

    await service.replace(document, file);

    const requests = this.server.pretender.handledRequests.filter(
      (request) => !request.url.includes("documents"),
    );

    assert.strictEqual(requests.length, 1);
    assert.ok(requests[0].url.endsWith("files"));
  });
});
