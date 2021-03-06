#!/usr/bin/env node

const yargs = require("yargs");
const baseCreate = require("base-create");

const create = (options) => {
  const { eachPackage, ...restOptions } = options;

  const { argv } = yargs;

  let scope;
  let packageNamesArg;

  if (argv._[2]) {
    scope = argv._[1];
    packageNamesArg = argv._[2];
  } else {
    packageNamesArg = argv._[1];
  }

  if (!packageNamesArg) {
    throw new Error(
      "Must call with package names as comma-delimited argument."
    );
  }

  const packageNames = packageNamesArg.split(",");

  const packages = packageNames.map((packageName) => ({
    ...eachPackage,
    name: packageName,
    scope,
    skipGitignore: true,
  }));

  const createOptions = {
    ...restOptions,
    scope,
    devDependencies: ["lerna", ...(options.devDependencies || [])],
    package: {
      ...(options.package || []),
      private: true,
      main: undefined,
      workspaces: ["packages/*"],
    },
    packages,
    commands: [
      "lerna init",
      "lerna bootstrap --force-local",
      ...(options.commands || []),
    ],
  };

  return baseCreate(createOptions);
};

exports.default = create;
exports.create = create;
module.exports = create;
