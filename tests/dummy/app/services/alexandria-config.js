import ConfigService from "ember-alexandria/services/config";

export default class AlexandriaConfigService extends ConfigService {
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
    return new Promise((resolve) =>
      setTimeout(() => resolve((id || "").toUpperCase()), 200)
    );
  }
}
