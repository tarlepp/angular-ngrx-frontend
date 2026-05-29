# What is this?

This document contains information about _common_ tools that are included to
this application. All these tools are available inside application docker
container.

## Table of Contents

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [npm-check-updates](#npm-check-updates-table-of-contents)
  * [mversion](#mversion-table-of-contents)
  * [thefuck](#thefuck-table-of-contents)

## npm-check-updates [ᐞ](#table-of-contents)

npm-check-updates upgrades your package.json dependencies to the latest
versions, ignoring specified versions.

npm-check-updates maintains your existing semantic versioning policies, i.e.,
it will upgrade `"express": "^4.0.0"` to `"express": "^5.0.0"`.

* [Website](https://github.com/tjunnone/npm-check-updates)

## mversion [ᐞ](#table-of-contents)

A cross packaging manager module version handler/bumper. Imitates _npm version_
to also work on other packaging files. For those times you either have
multiple packaging files (like `bower.json`, `component.json`, `manifest.json`)
or just not a `package.json` file. mversion can easily bump your version and
optionally commit and create a tag.

* [Website](https://github.com/mikaelbr/mversion)

## thefuck [ᐞ](#table-of-contents)

`thefuck` is installed in the development container to provide command
correction aliases for bash and fish.

### Python 3.13 compatibility note

At the moment, `thefuck` `3.32` still imports deprecated Python `imp` from
`thefuck/conf.py` and `thefuck/types.py`. Python `3.13` removed `imp`, which
causes startup tracebacks when shells load `thefuck --alias`.

To keep development shells working, the Docker build applies a small
compatibility patch in `Dockerfile` that replaces `imp.load_source` usage with
an `importlib`-based `load_source` implementation.

This patch should be removed when upstream `thefuck` no longer imports `imp`.
Before removal, verify inside container:

```bash
thefuck --alias >/dev/null
```

* [Website](https://github.com/nvbn/thefuck)

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
