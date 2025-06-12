import { action } from "@ember/object";
import { service } from "@ember/service";
import { macroCondition, isTesting } from "@embroider/macros";
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
}
