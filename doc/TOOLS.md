# What is this?

This document contains information about _common_ tools that are included to
this application. All these tools are available inside application docker
container.

## Table of Contents

* [What is this?](#what-is-this)
    * [Table of Contents](#table-of-contents)
    * [npm-check-updates](#npm-check-updates)
    * [mversion](#mversion)

## npm-check-updates

npm-check-updates upgrades your package.json dependencies to the latest 
versions, ignoring specified versions.

npm-check-updates maintains your existing semantic versioning policies, i.e., 
it will upgrade "express": "^4.0.0" to "express": "^5.0.0".

* [Website](https://github.com/tjunnone/npm-check-updates)

## mversion

A cross packaging manager module version handler/bumper. Imitates _npm version_
to also work on other packaging files. For those times you have either have 
multiple packaging files (like `bower.json`, `component.json`, `manifest.json`) 
or just not a `package.json` file. mversion can easily bump your version and 
optionally commit and create a tag.

* [Website](https://github.com/mikaelbr/mversion)
