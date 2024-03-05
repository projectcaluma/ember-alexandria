import { later } from "@ember/runloop";
import { macroCondition, isTesting } from "@embroider/macros";

import AlexandriaConfigService from "ember-alexandria/services/alexandria-config";

export default class CustomAlexandriaConfigService extends AlexandriaConfigService {
  enablePDFConversion = true;
  enableWebDAV = true;

  markIcons = {
    decision: "stamp",
  };

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

  resolveUser(id) {
    const timeout = macroCondition(isTesting()) ? 1 : 200;

    return new Promise((resolve) =>
      later(this, () => resolve((id || "").toUpperCase()), timeout),
    );
  }
}
