# What is this?

This documentation contains information on how to update package dependencies
within this application. The documentation relies on that you are using
[Docker Engine](https://docs.docker.com/engine/install/) to run this
application.

## Table of Contents

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Quick steps](#quick-steps)
  * [Update Yarn itself](#update-yarn-itself)
  * [Major version update](#major-version-update)
  * [Other updates](#other-updates)
  * [External links and resources](#external-links-and-resources)

## Quick steps

There are a few quick steps below on what you need to do to update the
application package dependencies.

1. Get `bash` to the container with `make bash` command
2. Use `ng update` to check Angular core package updates **and follow
   the instructions of this tool to update these packages**
3. Update rest of the packages, with one of the following commands:
   1. Use `make update` command to use interactive Yarn 4 update command to
      update all the packages.
   2. Use `ncu` to list remaining packages that can be updated. Then you can
      * Change the versions to `package.json` file and restart the application
        container - this will trigger `yarn` to install new versions of those
        packages and also updates `yarn.lock` file properly.
      * Or just use `ncu -u` to automatically update all of those packages and
        restart the application container.
   3. Run command `yarn up <package>@<version>` which will update both
      `package.json` and `yarn.lock`. After doing this for all needed
      packages, restart the application container.
4. Re-run install with lockfile validation:

   ```bash
   yarn install --immutable
   ```

5. Test that the application works.
6. Profit ¯\\\_(ツ)_/¯

### Yarn 4 notes

This repository is pinned to Yarn 4 via `packageManager` in `package.json`
and the project-managed release under `.yarn/releases/`.

When working in Docker (`make bash`) or Dev Containers, run `yarn` commands
from the project root so the pinned Yarn version is used.

## Update Yarn itself

Use these steps when you want to update Yarn to the latest stable version for
this repository.

1. Open shell inside the running container:

   ```bash
   make bash
   ```

2. Update Yarn release used by this project:

   ```bash
   yarn set version stable
   yarn --version
   ```

3. Refresh lockfile/install metadata and validate:

   ```bash
   yarn install --immutable
   ```

4. Commit changed Yarn files (typically `package.json`, `.yarnrc.yml`,
   `.yarn/releases/*`, and sometimes `yarn.lock`).

## Major version update

When there is a `Major` version update (eg. 12.x.y to 13.0.0) within Angular we
need to check proper instructions from official [Angular Update Guide](https://update.angular.io).

## Other updates

From time to time it's a good idea to update library dependencies as well.

Use one of the following commands depending on your goal:

```bash
yarn up -i            # interactive updates
yarn up <package>     # update one package
yarn up               # update according to semver ranges
yarn install --immutable
```

## External links and resources

* [Angular Update Guide](https://update.angular.io)
* [ng update](https://angular.io/cli/update)
* [Yarn CLI - up](https://yarnpkg.com/cli/up)

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
