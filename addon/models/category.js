import { service } from "@ember/service";
import { attr, hasMany, belongsTo } from "@ember-data/model";
import { LocalizedModel, localizedAttr } from "ember-localized-model";

export default class CategoryModel extends LocalizedModel {
  @service("alexandria-config") config;

  @localizedAttr name;
  @localizedAttr description;
  @attr color;
  @attr metainfo;
  @attr allowedMimeTypes;
  @attr sort;

  @belongsTo("category", { inverse: "children", async: true }) parent;
  @hasMany("category", { inverse: "parent", async: true }) children;
  @hasMany("document", { inverse: "category", async: true }) documents;

  /**
   * Value for the `accept` attribute of a file input. Mime types without
   * configured extensions are listed as mime type, so that all of their
   * extensions stay selectable.
   *
   * Since browsers don't know every mime type - `image/vnd.dwg` or
   * `application/vnd.ms-outlook` for instance - all extensions known to the
   * configured `mime` instance are listed as well.
   *
   * @returns {String} Comma separated list of file extensions and mime types
   */
  get accept() {
    const entries = Object.entries(this.allowedMimeTypes);

    const mimeTypes = entries
      .filter(([, extensions]) => !extensions?.length)
      .map(([mimeType]) => mimeType);

    const configuredExtensions = entries.flatMap(
      ([, extensions]) => extensions ?? [],
    );

    const knownExtensions = mimeTypes.flatMap((mimeType) => [
      ...(this.config.mime.getAllExtensions(mimeType) ?? []),
    ]);

    const extensions = new Set(
      [...configuredExtensions, ...knownExtensions].map(
        (extension) => `.${extension}`,
      ),
    );

    return [...mimeTypes, ...extensions].join(",");
  }

  /**
   * All file extensions that are allowed in this category. Mime types without
   * configured extensions fall back to their canonical extension. Mime types
   * that are unknown to the configured `mime` instance are omitted.
   *
   * This is meant for displaying the allowed file types to users, as they
   * won't understand mime types.
   *
   * @returns {String} Comma separated list of allowed file extensions
   */
  get allowedExtensions() {
    return Object.entries(this.allowedMimeTypes)
      .flatMap(([mimeType, extensions]) =>
        extensions?.length
          ? extensions
          : this.config.mime.getExtension(mimeType),
      )
      .filter(Boolean)
      .join(", ");
  }
}
