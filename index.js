#!/usr/bin/env node

const yargs = require("yargs");
const baseCreate = require("base-create");

const create = (name, options) => {
  const { eachPackage, ...restOptions } = options;

  const { argv } = yargs;

  let scopeNameArg;
  let packageNamesArg;

  if (argv._.length >= 2) {
    scopeNameArg = argv._[0];
    packageNamesArg = argv._[1];
  } else {
    packageNamesArg = argv._[0];
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
  }));

  const createOptions = {
    config: {
      scope: scopeNameArg,
    },
    ...restOptions,
    devDependencies: ["lerna", ...(options.devDependencies || [])],
    package: {
      ...(options.package || []),
      workspaces: ["packages/*"],
    },
    packages,
    commands: [
      "lerna init",
      "lerna bootstrap --force-local",
      ...(options.commands || []),
    ],
  };

  return baseCreate(name, createOptions);
};

exports.default = create;
exports.create = create;
module.exports = create;
