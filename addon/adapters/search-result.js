export default function (BaseClass) {
  return class SearchResultAdapter extends BaseClass {
    // Overwrite and replicate the query function,
    // because ember doesnt pass adapterOptions to urlForQuery
    query(_, type, query, __, options) {
      let url = this.buildURL(type.modelName, null, null, "query", query);

      if (options?.adapterOptions?.customEndpoint) {
        url = `${this.buildURL()}/${options.adapterOptions.customEndpoint}`;
      }

      return this.ajax(url, "GET", { data: query });
    }
  };
}
