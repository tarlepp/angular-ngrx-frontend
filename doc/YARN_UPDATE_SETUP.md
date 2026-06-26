# Yarn Update System Setup

## What Is Configured

The repository pins Yarn and keeps the Yarn release in source control.

- `package.json` field `packageManager`
- `.yarnrc.yml` field `yarnPath`
- `.yarn/releases/` checked-in Yarn binary

## Make Targets

- `make yarn-status`
- `make yarn-upgrade`
- `make yarn-upgrade-check`
- `make yarn upgrade` (compatible alias)

## Script Layout

Yarn logic is extracted to reusable scripts.

- `scripts/yarn-lib.sh`
- `scripts/yarn-status.sh`
- `scripts/yarn-upgrade.sh`
- `scripts/yarn-upgrade-check.sh`

## Behavior Summary

- `yarn-status` prints configured, active, and latest stable version.
- `yarn-upgrade` updates project-pinned Yarn files and active version.
- `yarn-upgrade-check` is dry-run only and changes no files.

## Verify

```bash
make yarn-status
make yarn-upgrade-check
```

```bash
make yarn-upgrade VERSION=4.17.0
```

## Expected File Changes After Upgrade

- `package.json`
- `.yarnrc.yml`
- `.yarn/releases/yarn-<version>.cjs`

## Related Docs

- `doc/YARN_UPDATE.md`
- `doc/YARN_UPDATE_QUICK_REF.md`
- `doc/README.md`
