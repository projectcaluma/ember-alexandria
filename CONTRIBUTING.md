# How To Contribute

## Installation

- `git clone <repository-url>`
- `cd ember-alexandria`
- `pnpm install`

## Linting

- `pnpm lint`
- `pnpm lint:fix`

## Running tests

- `pnpm test` – Runs the test suite on the current Ember version
- `pnpm test:ember --server` – Runs the test suite in "watch mode"
- `pnpm test:ember-compatibility` – Runs the test suite against multiple Ember versions

## Running the dummy application

- `pnpm start` (with mirage backend) or `pnpm start-proxy` (with real backend running on [http://localhost:8000](http://localhost:8000))
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://cli.emberjs.com/release/](https://cli.emberjs.com/release/).
