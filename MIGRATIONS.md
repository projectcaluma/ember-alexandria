# Migrations

## v8 to v9

To upgrade to v9, please add `"store"` to the engine service dependencies like so:

```js
// app/app.js

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
          "store", // new
        ],
      },
    },
  };
}
```

And run `ember generate ember-alexandria` to create the required app re-exports for `ember-data`.
