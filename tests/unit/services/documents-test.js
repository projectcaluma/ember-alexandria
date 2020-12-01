import { setupMirage } from "ember-cli-mirage/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | documents", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test("it exists", function (assert) {
    const service = this.owner.lookup("service:documents");
    assert.ok(service);
  });

  test("it uploads documents", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    const service = this.owner.lookup("service:documents");

    const category = this.server.create("category");
    const files = [
      new File(["1"], "test1.docx"),
      new File(["2"], "test2.docx"),
      new File(["3"], "test3.docx"),
    ];

    await service.upload(category, files);

    // Each file generates three requests.
    assert.equal(requests.length, files.length * 3);

    // Files will be uploaded in parallel. So, we cannot know the order.
    const documentRequests = requests.filter((request) =>
      request.url.endsWith("documents")
    );
    const fileRequests = requests.filter((request) =>
      request.url.endsWith("files")
    );
    const uploadRequests = requests.filter((request) =>
      request.url.endsWith("file-upload")
    );

    assert.equal(documentRequests.length, files.length);
    assert.equal(fileRequests.length, files.length);
    assert.equal(uploadRequests.length, files.length);
  });

  test("it replaces documents", async function (assert) {
    const requests = this.server.pretender.handledRequests;

    const service = this.owner.lookup("service:documents");

    const document = this.server.create("document");
    const file = new File([""], "test.docx");

    await service.replace(document, file);

    assert.equal(requests.length, 2);
    assert.ok(requests[0].url.endsWith("files"));
    assert.ok(requests[1].url.endsWith("file-upload"));
  });
});
