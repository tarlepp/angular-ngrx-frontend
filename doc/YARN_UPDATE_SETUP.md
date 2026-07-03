# What is this?

This document explains the repository setup used for pinned Yarn update
workflows.

## Table of Contents [ᐞ](#table-of-contents)

<a id="table-of-contents"></a>

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [What Is Configured](#what-is-configured)
  * [Make Targets](#make-targets)
  * [Script Layout](#script-layout)
  * [Behavior Summary](#behavior-summary)
  * [Verify](#verify)
  * [Expected File Changes After Upgrade](#expected-file-changes-after-upgrade)
  * [Related Docs](#related-docs)

## What Is Configured [ᐞ](#table-of-contents)

<a id="what-is-configured"></a>

The repository pins Yarn and keeps the Yarn release in source control.

* `package.json` field `packageManager`
* `.yarnrc.yml` field `yarnPath`
* `.yarn/releases/` checked-in Yarn binary

## Make Targets [ᐞ](#table-of-contents)

<a id="make-targets"></a>

* `make yarn-status`
* `make yarn-upgrade`
* `make yarn-upgrade-check`
* `make yarn upgrade` (compatible alias)

## Script Layout [ᐞ](#table-of-contents)

<a id="script-layout"></a>

Yarn logic is extracted to reusable scripts.

* `scripts/yarn-lib.sh`
* `scripts/yarn-status.sh`
* `scripts/yarn-upgrade.sh`
* `scripts/yarn-upgrade-check.sh`

## Behavior Summary [ᐞ](#table-of-contents)

<a id="behavior-summary"></a>

* `yarn-status` prints configured, active, and latest stable version.
* `yarn-upgrade` updates project-pinned Yarn files and active version.
* `yarn-upgrade-check` is dry-run only and changes no files.

## Verify [ᐞ](#table-of-contents)

<a id="verify"></a>

```bash
make yarn-status
make yarn-upgrade-check
```

```bash
make yarn-upgrade VERSION=4.17.0
```

## Expected File Changes After Upgrade [ᐞ](#table-of-contents)

<a id="expected-file-changes-after-upgrade"></a>

* `package.json`
* `.yarnrc.yml`
* `.yarn/releases/yarn-<version>.cjs`

## Related Docs [ᐞ](#table-of-contents)

<a id="related-docs"></a>

* `doc/YARN_UPDATE.md`
* `doc/YARN_UPDATE_QUICK_REF.md`
* `doc/README.md`

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
