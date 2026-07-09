# What is this?

This document explains how to manage the repository-pinned Yarn version.

## Table of Contents [ᐞ](#table-of-contents)

<a id="table-of-contents"></a>

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Overview](#overview)
  * [Check Current State](#check-current-state)
  * [Upgrade Yarn](#upgrade-yarn)
  * [What Changes on Upgrade](#what-changes-on-upgrade)
  * [Implementation Details](#implementation-details)
  * [Manual Commands](#manual-commands)
  * [Troubleshooting](#troubleshooting)
    * [Latest Stable Cannot Be Resolved](#latest-stable-cannot-be-resolved)
    * [Version Mismatch](#version-mismatch)
    * [Confirm Project Pin](#confirm-project-pin)
  * [Related Docs](#related-docs)

## Overview [ᐞ](#table-of-contents)

<a id="overview"></a>

This project pins Yarn in-repo so development, CI, and Docker use the same
version.

Pinned Yarn is defined by:

* `package.json` field `packageManager`
* `.yarnrc.yml` field `yarnPath`
* checked-in release file in `.yarn/releases/`

## Check Current State [ᐞ](#table-of-contents)

<a id="check-current-state"></a>

```bash
make yarn-status
```

This prints:

* configured Yarn version
* active Yarn version
* latest stable Yarn Berry version
* update availability status

Dry-run check with no file changes:

```bash
make yarn-upgrade-check
```

## Upgrade Yarn [ᐞ](#table-of-contents)

<a id="upgrade-yarn"></a>

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

## What Changes on Upgrade [ᐞ](#table-of-contents)

<a id="what-changes-on-upgrade"></a>

Expected changed files:

* `package.json`
* `.yarnrc.yml`
* `.yarn/releases/yarn-<version>.cjs`

## Implementation Details [ᐞ](#table-of-contents)

<a id="implementation-details"></a>

Make targets call these scripts:

* `scripts/yarn-lib.sh`
* `scripts/yarn-status.sh`
* `scripts/yarn-upgrade.sh`
* `scripts/yarn-upgrade-check.sh`

Upgrade flow:

1. update `packageManager` in `package.json`
2. run `yarn set version` to update `.yarnrc.yml` and release file
3. run `corepack prepare yarn@<version> --activate`

## Manual Commands [ᐞ](#table-of-contents)

<a id="manual-commands"></a>

```bash
npm pkg set packageManager="yarn@4.17.0"
yarn set version "4.17.0"
corepack prepare "yarn@4.17.0" --activate

```

## Troubleshooting [ᐞ](#table-of-contents)

<a id="troubleshooting"></a>

### Latest Stable Cannot Be Resolved [ᐞ](#table-of-contents)

<a id="latest-stable-cannot-be-resolved"></a>

If latest lookup fails, use an explicit version:

```bash
make yarn-upgrade VERSION=4.17.0
```

### Version Mismatch [ᐞ](#table-of-contents)

<a id="version-mismatch"></a>

If configured and active differ, run:

```bash
make yarn-upgrade
make yarn-status
```

### Confirm Project Pin [ᐞ](#table-of-contents)

<a id="confirm-project-pin"></a>

```bash
node -p "require('./package.json').packageManager"
grep "yarnPath:" .yarnrc.yml
ls -1 .yarn/releases/
```

## Related Docs [ᐞ](#table-of-contents)

<a id="related-docs"></a>

* `doc/YARN_UPDATE_QUICK_REF.md`
* `doc/YARN_UPDATE_SETUP.md`
* `doc/README.md`

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
