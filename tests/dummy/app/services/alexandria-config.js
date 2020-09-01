import ConfigService from "ember-alexandria/services/config";

export default class AlexandriaConfigService extends ConfigService {
  get modelMetaFilters() {
    return {
      document: [
        { key: "instance_id", value: this.alexandriaQueryParams.instance_id },
      ],
    };
  }

  get defaultModelMeta() {
    return {
      document: {
        instance_id: this.alexandriaQueryParams.instance_id,
      },
    };
  }
}
