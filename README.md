<h2 align=center>Cypress plugin filter-runnables</h2>
<p align="center">
</p>

<p align="center">
Cypress plugin that allows user to filter suites/tests in Cypress Test Runner.
</p>

![cypress-plugin-filter-runnables-demo-1](https://github.com/user-attachments/assets/fc9f3a8a-5de2-4ca1-8b73-2e26bacb3bf6)

## Features

- 🔍 A new UI search bar within `cypress open` to filter suites/tests in a given spec

#### Table of Contents

- [Installation](#-installation)
- [Open mode](#-open-mode)
  - [Pairing with cypress-plugin-grep-boxes](#pairing-with-cypress-plugin-grep-boxes)
- [Contributions](#contributions)

---

## 📦 Installation

1. Install the following packages:

```sh
npm install --save-dev cypress-plugin-filter-runnables
```

2. In `cypress/support/e2e.js` (For E2E tests) and/or `cypress/support/component.js` (For Component tests),

```js
import 'cypress-plugin-filter-runnables';
```

---

## 🔍 Open mode

Run `npx cypress open` to launch Cypress in `open` mode.

Choose a spec file to run and you will be able to filter by suite/test title at the top of the reporter.

You can combine multiple searches by separating them with a semicolon (`;`).

Example:

`@smoke; can add todo`

### Pairing with `cypress-plugin-grep-boxes`

The [cypress-plugin-grep-boxes](https://github.com/dennisbergevin/cypress-plugin-grep-boxes) is a great companion for this plugin.

Paired with `cypress-plugin-grep-boxes` (`@bahmutov/cy-grep` is also required), you can filter suites/tests and use the checkboxes to run only selected tests:

![cypress-plugin-filter-runnables-demo-2](https://github.com/user-attachments/assets/59053e87-cbfa-4a49-81a0-6212abc94ba8)

Additionally, you can filter tags when paired with `cypress-plugin-grep-boxes` (version `2.1.0` of `@bahmutov/cy-grep` required):

![filter-runnables-grep-boxes-tags](https://github.com/user-attachments/assets/2c359ddf-cf54-4f48-a34a-b9cae4620acd)

In addition, `cypress-plugin-grep-boxes` supports a [disableInitialAutoRun feature](https://github.com/dennisbergevin/cypress-plugin-grep-boxes/blob/main/README.md#disableinitialautorun) that will prevent Cypress Test Runner from automatically running available tests once a spec file is open.

This gives you a moment to filter down to whichever tests to select before running them:

![cypress-plugin-filter-runnables-demo-3](https://github.com/user-attachments/assets/e10262db-7f88-4852-9cc8-1b4626e13f45)

## Contributions

Feel free to open a pull request or drop any feature request or bug in the [issues](https://github.com/dennisbergevin/cypress-plugin-filter-runnables/issues).

Please see more details in the [contributing doc](./CONTRIBUTING.md).
