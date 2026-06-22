# Yarn Version Management

## Overview

This project pins Yarn in-repo so development, CI, and Docker use the same
version.

Pinned Yarn is defined by:

- `package.json` field `packageManager`
- `.yarnrc.yml` field `yarnPath`
- checked-in release file in `.yarn/releases/`

## Check Current State

```bash
make yarn-status
```

This prints:

- configured Yarn version
- active Yarn version
- latest stable Yarn Berry version
- update availability status

Dry-run check with no file changes:

```bash
make yarn-upgrade-check
```

## Upgrade Yarn

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

## What Changes on Upgrade

Expected changed files:

- `package.json`
- `.yarnrc.yml`
- `.yarn/releases/yarn-<version>.cjs`

## Implementation Details

Make targets call these scripts:

- `scripts/yarn-lib.sh`
- `scripts/yarn-status.sh`
- `scripts/yarn-upgrade.sh`
- `scripts/yarn-upgrade-check.sh`

Upgrade flow:

1. update `packageManager` in `package.json`
2. run `yarn set version` to update `.yarnrc.yml` and release file
3. run `corepack prepare yarn@<version> --activate`

## Manual Commands

```bash
npm pkg set packageManager="yarn@4.17.0"
yarn set version "4.17.0"
corepack prepare "yarn@4.17.0" --activate

```

## Troubleshooting

### Latest Stable Cannot Be Resolved

If latest lookup fails, use an explicit version:

```bash
make yarn-upgrade VERSION=4.17.0
```

### Version Mismatch

If configured and active differ, run:

```bash
make yarn-upgrade
make yarn-status
```

### Confirm Project Pin

```bash
node -p "require('./package.json').packageManager"
grep "yarnPath:" .yarnrc.yml
ls -1 .yarn/releases/
```

## Related Docs

- `doc/YARN_UPDATE_QUICK_REF.md`
- `doc/YARN_UPDATE_SETUP.md`
- `doc/README.md`
