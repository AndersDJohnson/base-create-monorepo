# base-create-monorepo

> Utility for npm init create-\* scripts for monorepos.

Based on [`base-create`](https://npm.im/base-create) but for monorepos.

If you want different options for different sub-packages, use `base-create` directly.

With an initializer package `create-custom-babel-monorepo` to create a monorepo project `my-app` with two nested packages `one` and `two`,
pass a comma-delimited list of package names to the command after the project name:

```
$ npm init custom-babel-monorepo my-app one,two
```

Or if you wanted an npm scope `@my-org` on your package names (`@my-org/my-app`, `@my-org/one`, and `@my-org/two`),
pass the org as an argument after the project name but before the package names:

```
$ npm init custom-babel-monorepo my-app @my-org one,two
```

Here is example source of such an initializer.
Options at the root apply to the root package,
and `eachPackage` defines options to apply to all sub-packages:

```js
#!/usr/bin/env node

const createMonorepo = require("base-create-monorepo");

createMonorepo("babel-typescript-monorepo", {
  devDependencies: ["lerna"],
  package: {
    scripts: {
      start: "lerna run start",
      build: "lerna run build",
      "build:watch": "lerna run --parallel build:watch",
    },
  },
  eachPackage: {
    dependencies: ["@babel/runtime"],
    devDependencies: [
      "@babel/core",
      "@babel/cli",
      "@babel/node",
      "@babel/preset-env",
      "@babel/preset-typescript",
      "@babel/plugin-transform-runtime",
      "typescript",
    ],
    package: {
      scripts: {
        start: "node .",
        build: "babel -x .ts,.tsx src --out-dir dist",
        "build:watch": "npm run build -- --watch",
      },
    },
    files: ["src/index.ts"],
  },
  files: [
    {
      path: "babel.config.json",
      contents: {
        presets: ["@babel/preset-env", "@babel/preset-typescript"],
        plugins: ["@babel/plugin-transform-runtime"],
      },
    },
  ],
});
```
