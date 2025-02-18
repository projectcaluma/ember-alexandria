# ember-alexandria

![CI](https://github.com/projectcaluma/ember-alexandria/workflows/CI/badge.svg)
[![Dependabot](https://img.shields.io/librariesio/github/projectcaluma/ember-alexandria)](https://dependabot.com/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](https://spdx.org/licenses/AGPL-3.0-or-later.html)

The frontend for the [alexandria](https://github.com/projectcaluma/alexandria)
document management service

## Compatibility

- Ember.js v4.12 or above
- Ember CLI v4.12 or above
- Node.js v18 or above

## Installation

```bash
ember install ember-alexandria
```

Then add the following lines to your `app/styles/app.scss`:

```scss
@import "ember-uikit";
@import "ember-alexandria";
```

## Usage

Mount the engine with the following command in your `app/router.js`:

```js
this.mount("ember-alexandria", { path: "/" });
```

To pass the required services update your `app.js`:

```js
constructor(...args) {
  super(...args);

  this.engines = {
    "ember-alexandria": {
      dependencies: {
        services: [
          "session",
          "intl",
          "notification",
          "fetch",
          "alexandria-config",
          "store",
        ],
      },
    },
  };
}
```

## Configuration

You can configure if the models should be filtered by meta and what the default
meta value for a model should be. Each configuration field is scoped by model name
(check out the example to understand what is meant by this).

For this you need to create a service extending from
`ember-alexandria/services/alexandria-config` which you then have to pass as
`alexandria-config` to alexandria.

This is needed since an engine does not merge its env into the host apps.
See https://github.com/ember-engines/ember-engines/issues/176 for more info.

If you mounted alexandria with query params
`this.mount("ember-alexandria", {path: "/:your_query_param/documents/"});`
you can access the query params in you config service (as shown in the example
above) with `this.alexandriaQueryParams.your_query_param`.

If you need to access the `alexandriaQueryParams` inside your config check that you define `modelMetaFilters`
and/or `defaultModelMeta` as getters. If you don't need `alexandriaQueryParams` you
can ignore the getters and just define the field as usual.

**Example**:

```js
import AlexandriaConfigService from "ember-alexandria/services/alexandria-config";

export default class CustomAlexandriaConfigService extends AlexandriaConfigService {
  get modelMetaFilters() {
    return {
      document: [
        {
          key: "your_meta_field",
          value: this.alexandriaQueryParams.your_query_param,
        },
      ],
    };
  }

  get defaultModelMeta() {
    return {
      document: {
        your_meta_field: this.alexandriaQueryParams.your_query_param,
      },
      file: {
        is_alexandria_file: true,
      },
    };
  }
}
```

To set `created_by_user` and `created_by_group` on a document you can use the
`activeUser` and `activeGroup` properties. They will be set on the document
when it is created.
The returned IDs for the user and groups you can be proccessed by adding a
resolver from your project to turn the IDs to something the user can relate to.

Just replace the identity functions on the config service.

Additionally there is a post proccess hook for the document. It is called `documentsPostProccess` and is executed after the document list is fetched. It gets the documents as an argument and should return the documents as well.
With it you for example fetch the users and groups of the documents in a batch.

**Example**:

```js
import AlexandriaConfigService from "ember-alexandria/services/alexandria-config";
import { inject as service } from "@ember/service";

export default class CustomAlexandriaConfigService extends AlexandriaConfigService {
  @service store;

  activeUser = 1;
  activeGroup = 1;

  resolveUser(id) {
    return this.store.peekRecord("user", id);
  }

  resolveGroup(id) {
    return this.store.peekRecord("group", id);
  }

  documentsPostProcess(documents) {
    const users = documents.map((d) => d.createdByUser);
    const groups = documents.map((d) => d.createdByGroup);

    this.store.query("user", { filter: { id: users.join(",") } });
    this.store.query("group", { filter: { id: groups.join(",") } });

    return documents;
  }
}
```

If there is a need for filtering the tagging suggestions set the getter `suggestedTagsFilters` to the desired filter.

### Marks

Additionally to tags you can configure marks. Marks are similar to tags, but are always displayed for the user to add, even when then are not selected yet. This avoids the issue where users might create multiple, slightly different tags while meaning the same thing. We recommend using not more than five marks for the most important classifications of documents.

The icons for marks are from [FontAwesome](https://fontawesome.com/search?o=r&m=free&s=regular%2Csolid).

The object for a mark has the following properties:

- `type`: This is the id of a tag used to identify the mark in the backend.
- `icon`: This a string, which references an FontAwesome.
- `tooltip`: This is shown when hovering over the mark.

An example configuration with two icons might look like this:

```js
import AlexandriaConfigService from "ember-alexandria/services/alexandria-config";

export default class CustomAlexandriaConfigService extends AlexandriaConfigService {
  get marks() {
    return [
      {
        type: "important",
        tooltip: "This is an important document",
        icon: "stamp",
      },
      {
        type: "problem",
        tooltip: "This document has problems",
        icon: "hippo",
      },
    ];
  }
}
```

Configure used icons in `config/icons.js`

```js
module.exports = function () {
  return {
    "free-solid-svg-icons": ["stamp", "hippo"],
  };
};
```

### Search link

To configure where the link in the search result point to and what it displays use the `documentListLinkTo` function.
It receives a document as paramter and expects an object with a route and the label to display.

```js
documentListLinkTo(document) {
  return {
    route: "index",
    label: document.title,
  };
}
```

### Others

- `enablePDFConversion`: Set to `true` to enable docx/odt to pdf conversion. Make sure the backend is enabled aswell.
- `enableWebDAV`: Set to `true` to enable docx/xlsx editing with WebDAV. Make sure the backend is enabled aswell.
- `allowedWebDAVMimeTypes`: Sets the allowed editable mime types (default: docx, xlsx). Make sure the list is the same as in the backend.
- `namespace`: Set to API namespace
- `zipDownloadHost`: Set if the ZIP download is different
- `zipDownloadNamespace`: Set if the ZIP download is namespaced

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [AGPL-3.0-or-later license](LICENSE).
