# ***reddit-VUEer*** : a Vue.js & TypeScript project
<p float="left">
  <img src="./src/assets/images/logo.svg" width="65" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./src/assets/images/ts.svg" width="55" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./src/assets/images/cy.svg" width="140" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./src/assets/images/vitejs.svg" width="60" /> 
</p>

This is a Vite-powered project constructed using JSON data from the reddit API. The app allows users to browse, filter and paginate through threads. interact with multimedia content, search for specific threads and subreddits, view comments, search users' profiles and activity, and more. 

> You can visit the app using **[this link](https://vuer.netlify.app)**.

## [The app in action](https://vuer.netlify.app/)
[<img src="./src/assets/screenshots/peek-demo.gif" width="700" alt="Browsing the various sections of the app."/>](https://vuer.netlify.app/)

## Mobile view

[<img src='./src/assets/screenshots/mobile-peek-demo.gif' width="300" alt="Viewing the application on a mobile device."/>](https://vuer.netlify.app/)

## Key product features
- Strict type-checking and type-based declarations fully integrated into every part of the app.
- Utilises [**composition API**](https://vuejs.org/guide/extras/composition-api-faq.html) for component setup, hooks and reactivity features.
- [Data fetching](/src/utils/apiRequests.ts) and asynchronous error handling using the reddit JSON API.
- Includes [end-to-end testing with **Cypress**](/cypress/e2e/UserJourneys.cy.ts) and [unit testing with **Mocha + Chai**](/src/components/__tests__/unit-tests.cy.ts).
- Extensive use of props, watchers, lifecycle hooks, emitted events and conditional rendering.
- Features [recursive components](/src/components/NestedReplies.vue) for unknown configurations of deeply nested replies.
- [Vue Router](/src/router/index.ts) for declarative and imperative client-side navigation.
- [Image gallery slideshows](/src/assets/screenshots/gallery.gif) animated using Vue transition groups.
- Mobile-first design with an engaging user experience.


## Running the project in your local environment
### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Project Setup
After forking and cloning the repository:
```sh
npm install
```

### Compile and hot-reload for development

```sh
npm run dev
```

### Type-checking

```sh
npm run type-check
```

### Run unit tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
# start the development server
npm run dev

# option 1: run tests in browser
npm run test:e2e:dev

# option 2: run tests in headless mode
npx cypress run --headless --browser chrome
```
For option 1, once the Cypress app is launched, you will need to click on the **[```UserJourneys.cy.ts```](/cypress/e2e/UserJourneys.cy.ts)** E2E spec to run the test suite.