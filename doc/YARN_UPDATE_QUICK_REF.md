# Yarn Update Quick Reference

## Simplest Update

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

## Check Current State

Show configured, active, and latest stable versions:

```bash
make yarn-status
```

Dry-run upgrade check with no file changes:

```bash
make yarn-upgrade-check
```

## Manual Upgrade Steps

```bash
npm pkg set packageManager="yarn@4.17.0"
yarn set version "4.17.0"
corepack prepare "yarn@4.17.0" --activate
yarn --version
```

## After Upgrading

```bash
yarn install
make lint
```

```bash
git add package.json .yarnrc.yml .yarn/releases/
git commit -m "chore: upgrade Yarn to 4.17.0"
git push
```

## Files That Change

- `package.json`
- `.yarnrc.yml`
- `.yarn/releases/yarn-X.Y.Z.cjs`

## Full Documentation

- `doc/YARN_UPDATE.md`
- `doc/YARN_UPDATE_SETUP.md`

## Find Latest Yarn Version

```bash
curl -fsSL https://api.github.com/repos/yarnpkg/berry/releases/latest \
  | python3 -c "import json,sys;print(json.load(sys.stdin)['tag_name'])"
```

---

Back to docs index: `doc/README.md`
