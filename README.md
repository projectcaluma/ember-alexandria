# ember-alexandria

![Test](https://github.com/projectcaluma/ember-alexandria/workflows/Test/badge.svg)
[![Dependabot](https://img.shields.io/librariesio/github/projectcaluma/ember-alexandria)](https://dependabot.com/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://spdx.org/licenses/LGPL-3.0-or-later.html)

The frontend for the [alexandria](https://github.com/projectcaluma/alexandria)
document management service

## Compatibility

- Ember.js v4.4 or above
- Ember CLI v4.4 or above
- Node.js v14 or above

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
          { config: "alexandria-config" },
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
`ember-alexandria/services/config` which you then have to pass as `config` to
alexandria.

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
import ConfigService from "ember-alexandria/services/config";

export default class AlexandriaConfigService extends ConfigService {
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
import ConfigService from "ember-alexandria/services/config";
import { inject as service } from "@ember/service";

export default class AlexandriaConfigService extends ConfigService {
  @service store;
  
  activeUser = 1;
  activeGroup = 1;

  resolveUser(id) { return this.store.peekRecord("user", id); }
  resolveGroup(id) { return this.store.peekRecord("group", id); }

  documentsPostProcess(documents) {
    const users = documents.map((d) => d.createdByUser);
    const groups = documents.map((d) => d.createdByGroup);

    this.store.query("user", { filter: { id: users.join(",") } });
    this.store.query("group", { filter: { id: groups.join(",") } });

    return documents
  }
}
```

### Marks

Additionally to tags you can configure marks. Marks are similar to tags, but are always displayed for the user to add, even when then are not selected yet. This avoids the issue where users might create multiple, slightly different tags while meaning the same thing. We recommend using not more than five marks for the most important classifications of documents.

The icons for marks are either from [UIkit](https://getuikit.com/docs/icon) or you can use an svg string. To use an svg string you need to wrap it in `htmlSafe` from `@ember/template`.

The object for a mark has the following properties:
- `type`: This is the id of a tag used to identify the mark in the backend.
- `icon`: This can be either a string (referring to an UIkit icon name) or an `htmlSafe` object (containing SVG icon source code).
- `tooltip`: This is shown when hovering over the mark.

An example configuration with two icons might look like this:

```js
import ConfigService from "ember-alexandria/services/config";
import { htmlSafe } from "@ember/template";

export default class AlexandriaConfigService extends ConfigService {
  get marks() {
    return [
      {
        type: "important",
        tooltip: "This is an important document",
        icon: "bolt",
      },
      {
        type: "problem",
        tooltip: "This document has problems",
        icon: htmlSafe(
          `<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 0c53 0 96 43 96 96v3.6c0 15.7-12.7 28.4-28.4 28.4H188.4c-15.7 0-28.4-12.7-28.4-28.4V96c0-53 43-96 96-96zM41.4 105.4c12.5-12.5 32.8-12.5 45.3 0l64 64c.7 .7 1.3 1.4 1.9 2.1c14.2-7.3 30.4-11.4 47.5-11.4H312c17.1 0 33.2 4.1 47.5 11.4c.6-.7 1.2-1.4 1.9-2.1l64-64c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-64 64c-.7 .7-1.4 1.3-2.1 1.9c6.2 12 10.1 25.3 11.1 39.5H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H416c0 24.6-5.5 47.8-15.4 68.6c2.2 1.3 4.2 2.9 6 4.8l64 64c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-63.1-63.1c-24.5 21.8-55.8 36.2-90.3 39.6V240c0-8.8-7.2-16-16-16s-16 7.2-16 16V479.2c-34.5-3.4-65.8-17.8-90.3-39.6L86.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64-64c1.9-1.9 3.9-3.4 6-4.8C101.5 367.8 96 344.6 96 320H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96.3c1.1-14.1 5-27.5 11.1-39.5c-.7-.6-1.4-1.2-2.1-1.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3z"/></svg>`,
        ),
      },
    ];
  }
}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [LGPL-3.0-or-later license](LICENSE).
