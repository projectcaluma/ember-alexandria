import { setupTest } from "dummy/tests/helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";
import { fake } from "sinon";

module("Unit | Service | alexandria-documents", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test.each(
    "it uploads documents",
    [
      {},
      { muteNotification: true },
      { muteNotification: false },
      { extraMetainfo: { foo: "bar" } },
    ],
    async function (assert, options) {
      const service = this.engine.lookup("service:alexandria-documents");
      const store = this.owner.lookup("service:store");

      const category = await store.findRecord(
        "category",
        this.server.create("category").id,
      );

      const docxMimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const files = [
        new File(["1"], "test1.docx", { type: docxMimeType }),
        new File(["2"], "test2.docx", { type: docxMimeType }),
        new File(["3"], "test3.docx", { type: docxMimeType }),
      ];

      const fakeSuccess = fake();
      Object.defineProperty(
        this.owner.lookup("service:notification"),
        "success",
        {
          value: fakeSuccess,
        },
      );

      await service.upload(category, files, options);

      if (options.muteNotification) {
        assert.strictEqual(fakeSuccess.callCount, 0);
      } else {
        assert.strictEqual(fakeSuccess.callCount, 1);
        assert.deepEqual(
          fakeSuccess.args[0][0],
          "The documents were uploaded successfully.",
        );
      }

      const requests = this.server.pretender.handledRequests.filter(
        (request) => !request.url.includes("categories"),
      );

      assert.strictEqual(requests.length, files.length);

      // Files will be uploaded in parallel. So, we cannot know the order.
      const documentRequests = requests.filter((request) =>
        request.url.endsWith("documents"),
      );

      assert.strictEqual(documentRequests.length, files.length);
      await Promise.all(
        documentRequests.map(
          (request) =>
            new Promise((resolve) => {
              const blob = request.requestBody.get("data");
              const reader = new FileReader();
              reader.readAsText(blob);
              reader.onload = () => {
                const result = JSON.parse(reader.result);

                assert.deepEqual(result.category, category.id);
                assert.deepEqual(result.metainfo, options.extraMetainfo || {});
                assert.ok(result.title.match(/^test\d\.docx$/));

                resolve();
              };
            }),
        ),
      );
    },
  );

  test("it restricts mime type", async function (assert) {
    const service = this.engine.lookup("service:alexandria-documents");
    const store = this.owner.lookup("service:store");

    const category = await store.findRecord(
      "category",
      this.server.create("category", {
        name: { en: "Foo" },
        allowedMimeTypes: ["application/pdf"],
      }).id,
    );
    const files = [new File(["1"], "test1.docx")];

    const fakeDanger = fake();
    Object.defineProperty(this.owner.lookup("service:notification"), "danger", {
      value: fakeDanger,
    });

    await service.upload(category, files);

    assert.strictEqual(fakeDanger.callCount, 1);
    assert.deepEqual(
      fakeDanger.args[0][0],
      'In category "Foo" only pdf can be uploaded.',
    );
  });

  test("it replaces documents", async function (assert) {
    const service = this.engine.lookup("service:alexandria-documents");
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

  test("it downloads documents", async function (assert) {
    const service = this.engine.lookup("service:alexandria-documents");
    const store = this.owner.lookup("service:store");

    const document = this.server.create("document");
    const file = this.server.create("file", {
      document,
      name: document.title,
      variant: "original",
      downloadUrl: "http://earth.planet?expires=123456",
    });
    const documentModel = await store.findRecord("document", document.id);
    const fileModel = await store.findRecord("file", file.id);
    documentModel.latestFile = { value: fileModel };
    await service.download.perform([documentModel]);

    const requests = this.server.pretender.handledRequests;

    assert.strictEqual(requests.length, 4);
    assert.ok(requests[0].url.includes("documents"));
    assert.ok(requests[1].url.includes("files"));
    assert.ok(requests[2].url.includes("documents"));
    assert.ok(requests[3].url.includes("files"));
  });
});
