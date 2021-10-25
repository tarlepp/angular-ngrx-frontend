# What is this?

This documentation contains information on how to update package dependencies
within this application. The documentation relies on that you are using
`docker-compose` to run this application.

## Table of Contents

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Quick steps](#quick-steps-table-of-contents)
  * [Major version update](#major-version-update-table-of-contents)
  * [Other updates](#other-updates-table-of-contents)
  * [External links and resources](#external-links-and-resources-table-of-contents)

## Quick steps [ᐞ](#table-of-contents)

There are a few quick steps below on what you need to do to update the
application package dependencies.

1. Get `bash` to the container with `make bash` command
2. Use `ng update` to check Angular core package updates **and follow
   the instructions of this tool to update these packages**
3. Use `ncu` to list remaining packages that can be updated. Then you can
   * Change the versions to `package.json` file and restart the application
     container - this will trigger `yarn` to install new versions of those
     packages and also updates `yarn.lock` file properly.
   * OR
   * Run command `yarn upgrade <package>@<version>` which will update both
     `package.json` and `yarn.lock`. After doing this for all needed packages,
     restart the application container.
4. Test that the application works.
5. Profit ¯\\\_(ツ)_/¯

## Major version update [ᐞ](#table-of-contents)

When there is a `Major` version update (eg. 12.x.y to 13.0.0) within Angular we
need to check proper instructions from official [Angular Update Guide](https://update.angular.io).

## Other updates [ᐞ](#table-of-contents)

For time to time you need to update [browserslist](https://browserslist.dev/)
database. You can do this with following command;

```bash
npx browserslist@latest --update-db
```

## External links and resources [ᐞ](#table-of-contents)

* [Angular Update Guide](https://update.angular.io)
* [ng update](https://angular.io/cli/update)

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
