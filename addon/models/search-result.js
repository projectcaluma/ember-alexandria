import Model, { attr, belongsTo } from "@ember-data/model";

export default class SearchResultModel extends Model {
  @attr searchRank;
  @attr searchContext;
  @attr fileName;
  @attr documentName;

  @belongsTo("document", { inverse: null, async: false }) document;
  @belongsTo("matched-file", { inverse: null, async: false }) file;
}
