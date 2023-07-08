# *reddit-VUEer* : a Vue.js & TypeScript project
This ia a Vite-powered project constructed using JSON data from the reddit API. The app allows users to browse, filter and paginate through threads, search for specific threads and subreddits, view comments, search for users, and more. 

You can visit the app using this link.

<!-- ![MMI™ Flammarion Logo Badge](/src/assets/icons/updown.svg)
![MMI™ Flammarion Logo Badge](/src/assets/images/left.svg)
![MMI™ Flammarion Logo Badge]()
![MMI™ Flammarion Logo Badge](/src/assets/icons/updown.svg) -->

<p float="left">
  <img src="./src/assets/images/left.svg" width="50" />
  <img src="./src/assets/icons/updown.svg" width="50" /> 
  <img src="./src/assets/images/logo.svg" width="50" />
</p>


## Key product features
- Strict type-checking and type-based declarations fully integrated into every part of the app.
- Utilises **composition API** for component setup, hooks and reactivity features.
- Data fetching and asynchronous error handling using the reddit JSON API. 
- Extensive use of props, watchers, lifecycle hooks, emitted events and conditional rendering.
- Features recursive components for unknown configurations of deeply nested replies.
- Reusable components and functions with low coupling
- Vue Router for declarative and imperative client-side navigation
- Image gallery slideshows animated using Vue transition groups.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Headed Component Tests with [Cypress Component Testing](https://on.cypress.io/component)

```sh
npm run test:unit:dev # or `npm run test:unit` for headless testing
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

## Array.reduce()

```typescript
const computeReplyCount = (comment: JsonComment): number => {
  return comment.replies.data.children
  .reduce((accumulator: number, current: SingleComment) => {
    if (current.kind != 'more') return accumulator + 1;
    return accumulator;
  }, 0);
}
```

The callback function is called on each element. We must always remember to return the accumulator, even if a condition isn't satisfied like in this example.