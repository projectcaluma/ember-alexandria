import { action } from "@ember/object";
import { service } from "@ember/service";
import { isTesting, macroCondition } from "@embroider/macros";
import { dedupeTracked } from "tracked-toolbox";

import AlexandriaConfigService from "ember-alexandria/services/alexandria-config";

export default class CustomAlexandriaConfigService extends AlexandriaConfigService {
  @service router;

  enablePDFConversion = true;
  enableWebDAV = true;
  enableOriginalDocumentFilename = true;
  additionalFileTypes = {
    json: {
      icon: "file-code",
      label: "JSON",
      mimeTypes: ["application/json"],
    },
  };

  markIcons = {
    decision: "stamp",
    like: "heart",
    bill: "dollar-sign",
  };

  @dedupeTracked alexandriaQueryParams = {};

  get modelMetaFilters() {
    if (this.alexandriaQueryParams.instance_id) {
      return {
        document: [
          { key: "instance_id", value: this.alexandriaQueryParams.instance_id },
        ],
      };
    }
    return {};
  }

  get categoryQueryParameters() {
    return {};
  }

  get defaultModelMeta() {
    if (this.alexandriaQueryParams.instance_id) {
      return {
        document: {
          instance_id: this.alexandriaQueryParams.instance_id,
        },
      };
    }
    return {};
  }

  async resolveUser(id) {
    const timeout = macroCondition(isTesting()) ? 1 : 200;

    await new Promise((resolve) => setTimeout(resolve, timeout));

    return (id || "-").toUpperCase();
  }

  @action
  async documentListLinkTo(document) {
    const timeout = macroCondition(isTesting()) ? 1 : 200;

    await new Promise((resolve) => setTimeout(resolve, timeout));

    return {
      url: this.router.urlFor("alexandria-meta", 1, {
        queryParams: {
          document: document.id,
        },
      }),
      label: "View Detail",
    };
  }

  get documentListColumns() {
    return {
      type: {
        label: "type",
        labelHidden: true,
      },
      title: {
        label: "document-title",
        sort: true,
      },
      marks: {
        label: "marks",
        labelHidden: true,
      },
      date: {
        label: "date",
        sort: true,
      },
      modifiedAt: {
        label: "modified-at",
        sort: true,
      },
      createdByUser: {
        label: "created-by-user",
        sort: true,
      },
      createdByGroup: {
        label: "created-by-group",
        sort: true,
      },
      category: {
        label: "category",
        sort: true,
        // multisort example
        sortKey: [
          // name sort, asc/desc
          { key: "category__name" },
          // custom sort, asc only
          { key: "category__sort", icons: ["folder-tree"], directions: [""] },
          // custom sort, desc only
          { key: "category__test", icons: ["folder-tree"], directions: ["-"] },
        ],
      },
    };
  }
}
