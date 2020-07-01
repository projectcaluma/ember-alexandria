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

* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


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

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [LGPL-3.0-or-later license](LICENSE).

