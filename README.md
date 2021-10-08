ember-alexandria
==============================================================================

![Test](https://github.com/projectcaluma/ember-alexandria/workflows/Test/badge.svg)
[![Dependabot](https://badgen.net/dependabot/projectcaluma/ember-caluma/?icon=dependabot)](https://dependabot.com/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://spdx.org/licenses/LGPL-3.0-or-later.html)

The frontend for the [alexandria](https://github.com/projectcaluma/alexandria)
document management service

Compatibility
------------------------------------------------------------------------------

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js v12 or above


Installation
------------------------------------------------------------------------------

```bash
ember install ember-alexandria
```

Then add the following lines to your `app/styles/app.scss`:

```scss
@import "ember-uikit";
@import "ember-alexandria";
```


Usage
------------------------------------------------------------------------------

Mount the engine with the following command in your `app/router.js`:
```js
this.mount("ember-alexandria", { path: "/" });
```

To pass the required services update your `app.js`:
```js
constructor(...args) {
  super(...args);

  this.engines = {
    emberAlexandria: {
      dependencies: {
        services: ["store", "intl", "notification"],
      },
    },
  };
}
```

Configuration
------------------------------------------------------------------------------

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

__Example__:
```js
import ConfigService from "ember-alexandria/services/config";

export default class AlexandriaConfigService extends ConfigService {
  get modelMetaFilters() {
    return {
      document: [
        { key: "your_meta_field", value: this.alexandriaQueryParams.your_query_param
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
        is_alexandria_file: true
      }
    };
  }
}
```

As the Alexandria backend returns IDs for the user and groups you can add a
resolver from your project to turn the IDs to something the user can relate to.

Just replace the identity functions on the config service.

__Example__:
```js
import ConfigService from "ember-alexandria/services/config";
import { inject as service } from "@ember/service";

export default class AlexandriaConfigService extends ConfigService {
  @service store;
  
  resolveUser(id) { return this.store.peekRecord("user", id); }
  resolveGroup(id) { return this.store.peekRecord("group", id); }
}
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [LGPL-3.0-or-later license](LICENSE).

