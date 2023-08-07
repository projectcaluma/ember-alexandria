import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { htmlSafe } from "@ember/template";

export default class ConfigService extends Service {
  @tracked alexandriaQueryParams = {};

  /**
   * The active group is used for the createdByGroup property when creating new
   * documents and files. This is important as a user can be in multiple groups.
   */
  @tracked activeGroup = null;

  /**
   * Defaults so we can lookup
   * `this.config.modelMetaFilters.document`
   * without an exeption on modelMetaFilters.
   */
  get modelMetaFilters() {
    return {};
  }

  get defaultModelMeta() {
    return {};
  }

  get marks() {
    return [
      {
        type: "stamp",
        icon: htmlSafe(
          `<svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`,
        ),
        tooltip: "Mark as stamp",
      },
    ];
  }

  get markTypes() {
    return this.marks.map((mark) => mark.type);
  }

  resolveUser(id) {
    return id;
  }

  resolveGroup(id) {
    return id;
  }

  documentsPostProcess(documents) {
    return documents;
  }
}
