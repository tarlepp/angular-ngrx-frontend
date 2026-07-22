# What is this?

This directory contains different scripts that are used during development.

## Table of Contents [ᐞ](#table-of-contents)

<a id="table-of-contents"></a>

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Resources](#resources)
    * [Yarn management scripts](#yarn-management-scripts)
    * [Project stats script](#project-stats-script)
    * [GitHub Actions update checker](#github-actions-update-checker)

## Resources [ᐞ](#table-of-contents)

<a id="resources"></a>

* [Yarn management scripts](#yarn-management-scripts)
  * Manage the pinned Yarn version across the project
* [Project stats script](#project-stats-script)
  * Generate simple project statistics
* [GitHub Actions update checker](#github-actions-update-checker)
  * Check for updates to pinned GitHub Actions

### Yarn management scripts [ᐞ](#table-of-contents)

<a id="yarn-management-scripts"></a>

The project pins Yarn in-repo for consistent development, CI, and Docker environments.
Use these scripts via their Makefile entrypoints:

**Check current state:**

```bash
make yarn-status
```

* Shows configured Yarn version, active version, latest stable, and update availability

**Dry-run check (no file changes):**

```bash
make yarn-upgrade-check
```

* Performs all upgrade validations without modifying files

**Upgrade to latest stable:**

```bash
make yarn-upgrade
```

* Automatically detects and upgrades to the latest stable Yarn version

**Upgrade to explicit version:**

```bash
make yarn-upgrade VERSION=4.17.0
```

* Compatible alias: `make yarn upgrade VERSION=4.17.0`
* Updates `package.json`, `.yarnrc.yml`, and `.yarn/releases/`

**Alternative upgrade approach:**

```bash
make yarn-update VERSION=4.17.0
```

* Uses `scripts/update-yarn.sh` with detailed step-by-step output
* Requires explicit VERSION parameter

**Convenience workflow (check, validate, then upgrade):**

```bash
make yarn-check-and-upgrade
```

* Runs: `yarn-status` → `yarn-upgrade-check` → `yarn-upgrade` sequentially

Scripts referenced:

* `scripts/yarn-lib.sh` - Shared helper functions
* `scripts/yarn-status.sh` - Display current versions
* `scripts/yarn-upgrade.sh` - Primary upgrade script
* `scripts/yarn-upgrade-check.sh` - Dry-run validation
* `scripts/update-yarn.sh` - Alternative upgrade with detailed output

See `doc/YARN_UPDATE.md` and `doc/YARN_UPDATE_QUICK_REF.md` for detailed documentation.

### Project stats script [ᐞ](#table-of-contents)

<a id="project-stats-script"></a>

File: `scripts/project-stats.sh`

Generate simple project statistics:

```bash
make project-stats
```

If you are already inside the container, you can still run
`bash scripts/project-stats.sh` directly.

### GitHub Actions update checker [ᐞ](#table-of-contents)

<a id="github-actions-update-checker"></a>

File: `scripts/check-action-updates.sh`

```bash
make check-action-updates
```

If you are already inside the container, you can still run
`bash scripts/check-action-updates.sh` directly.

Print current pins as markdown:

```bash
bash scripts/check-action-updates.sh --current-pins-md
```

Exit codes:

* `0` = no discovery issues and no updates found
* `1` = updates available
* `2` = discovery issues found (for example unpinned refs or conflicting versions)

---

[Back to main README.md](../README.md)
