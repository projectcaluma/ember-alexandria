import { setupTest } from "dummy/tests/helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

module("Unit | Model | category", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.createCategory = async (options) => {
      const category = this.server.create("category", options);

      return await this.owner
        .lookup("service:store")
        .findRecord("category", category.id);
    };
  });

  test("it computes the accept attribute", async function (assert) {
    const category = await this.createCategory({
      allowedMimeTypes: {
        "image/jpeg": ["jpeg", "jpg"],
        // mime types without extensions accept all their extensions
        "application/pdf": null,
      },
    });

    assert.strictEqual(category.accept, ".jpeg,.jpg,application/pdf");
  });

  test("it computes the allowed extensions", async function (assert) {
    const category = await this.createCategory({
      allowedMimeTypes: {
        "image/jpeg": ["jpeg"],
        // mime types without extensions fall back to the canonical extension
        "application/pdf": null,
        // unknown mime types are omitted
        "application/vnd.sqlite3": null,
      },
    });

    assert.strictEqual(category.allowedExtensions, "jpeg, pdf");
  });

  test("it respects the configured custom mime types", async function (assert) {
    this.owner.lookup("service:alexandria-config").customMimeTypes = {
      "application/vnd.sqlite3": ["gpkg"],
    };

    const category = await this.createCategory({
      allowedMimeTypes: { "application/vnd.sqlite3": null },
    });

    assert.strictEqual(category.allowedExtensions, "gpkg");
    assert.strictEqual(category.accept, "application/vnd.sqlite3");
  });
});
