import Model, { attr } from "@ember-data/model";

export default class DeepsignServiceAccountModel extends Model {
  @attr group;
  @attr connectedAt;
  @attr connectionUrl;

  @attr createdAt;
  @attr createdByUser;
  @attr createdByGroup;
  @attr modifiedAt;
  @attr modifiedByUser;
  @attr modifiedByGroup;
}
