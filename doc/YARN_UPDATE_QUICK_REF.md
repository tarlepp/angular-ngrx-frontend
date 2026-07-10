# What is this?

This document is a quick command reference for checking and updating the
pinned Yarn version.

## Table of Contents [ᐞ](#table-of-contents)

<a id="table-of-contents"></a>

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Simplest Update](#simplest-update)
  * [Check Current State](#check-current-state)
  * [Manual Upgrade Steps](#manual-upgrade-steps)
  * [After Upgrading](#after-upgrading)
  * [Files That Change](#files-that-change)
  * [Full Documentation](#full-documentation)
  * [Find Latest Yarn Version](#find-latest-yarn-version)

## Simplest Update [ᐞ](#table-of-contents)

<a id="simplest-update"></a>

Use explicit version:

```bash
make yarn-upgrade VERSION=4.17.0
```

Use compatible alias:

```bash
make yarn upgrade VERSION=4.17.0
```

Use latest stable automatically:

```bash
make yarn-upgrade
```

## Check Current State [ᐞ](#table-of-contents)

<a id="check-current-state"></a>

Show configured, active, and latest stable versions:

```bash
make yarn-status
```

Dry-run upgrade check with no file changes:

```bash
make yarn-upgrade-check
```

## Manual Upgrade Steps [ᐞ](#table-of-contents)

<a id="manual-upgrade-steps"></a>

```bash
npm pkg set packageManager="yarn@4.17.0"
yarn set version "4.17.0"
corepack prepare "yarn@4.17.0" --activate
yarn --version
```

## After Upgrading [ᐞ](#table-of-contents)

<a id="after-upgrading"></a>

```bash
yarn install
make lint
```

```bash
git add package.json .yarnrc.yml .yarn/releases/
git commit -m "chore: upgrade Yarn to 4.17.0"
git push
```

## Files That Change [ᐞ](#table-of-contents)

<a id="files-that-change"></a>

* `package.json`
* `.yarnrc.yml`
* `.yarn/releases/yarn-X.Y.Z.cjs`

## Full Documentation [ᐞ](#table-of-contents)

<a id="full-documentation"></a>

* `doc/YARN_UPDATE.md`
* `doc/YARN_UPDATE_SETUP.md`

## Find Latest Yarn Version [ᐞ](#table-of-contents)

<a id="find-latest-yarn-version"></a>

```bash
curl -fsSL https://api.github.com/repos/yarnpkg/berry/releases/latest \
  | python3 -c "import json,sys;print(json.load(sys.stdin)['tag_name'])"
```

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
