# Yarn Update - Quick Reference

## The Simplest Way 🚀

### From host machine:
```bash
make yarn-upgrade VERSION=4.15.0
```

Or use the compatible alias:
```bash
make yarn upgrade VERSION=4.15.0
```

If `VERSION` is omitted, latest stable is used automatically.

### Or from inside Docker:
```bash
make bash
make yarn-upgrade VERSION=4.15.0
```

## Alternative Methods

### Using the helper script:
```bash
./scripts/update-yarn.sh 4.15.0
```

### Manual (inside Docker):
```bash
npm pkg set packageManager="yarn@4.15.0"
corepack prepare "yarn@4.15.0" --activate
yarn --version  # Verify
```

## Checking Current Version

```bash
make yarn-status
```

This prints configured, active, and latest stable Yarn versions, plus update availability and a suggested upgrade command when a newer stable release exists.

Dry-run upgrade check (no changes):

```bash
make yarn-upgrade-check
```

Or manually:
```bash
node -p "require('./package.json').packageManager"
```

## After Upgrading

```bash
# Test that everything works
yarn install
make lint

# Commit changes
git add package.json .yarnrc.yml .yarn/releases/
git commit -m "chore: upgrade Yarn to 4.15.0"
git push
```

## Files That Change

- ✏️ `package.json` - Updated version
- ✏️ `.yarnrc.yml` - Updated yarnPath (auto-generated)
- ✨ `.yarn/releases/yarn-X.Y.Z.cjs` - New binary file

## Full Documentation

See [doc/YARN_UPDATE.md](../doc/YARN_UPDATE.md) for comprehensive guide

## Find Latest Yarn Version

[GitHub Releases](https://github.com/yarnpkg/yarn/releases) or:
```bash
npm view yarn versions --json | tail -5
```

---

**Why so easy?** This project uses [Corepack](https://nodejs.org/docs/latest/api/corepack.html) - Node's official package manager manager.

