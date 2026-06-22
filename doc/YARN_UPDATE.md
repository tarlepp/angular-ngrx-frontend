# Yarn Version Management & Updates

> **Project**: Angular NgRx Frontend
> **Last Updated**: June 2026

## Overview

This project uses **Corepack** for seamless Yarn version management. Corepack is Node's official package manager manager (included with Node 16.13+), which ensures everyone on the team uses the exact same Yarn version.

## Current Setup

The project is configured with:

- **Corepack**: Manages Node package managers (npm, yarn, pnpm)
- **Single Source of Truth**: `"packageManager"` field in `package.json`
- **Bundled Distribution**: Yarn binary stored in `.yarn/releases/yarn-X.X.X.cjs`
- **Configuration**: `.yarnrc.yml` contains Yarn-specific settings

### Key Files

```
package.json            # Line 16: "packageManager": "yarn@4.14.1" ← Update here
.yarnrc.yml             # Line 8: yarnPath: .yarn/releases/yarn-4.14.1.cjs ← Auto-updated
.yarn/releases/         # Directory containing bundled Yarn binaries
Dockerfile              # Uses Corepack to activate correct version
Makefile                # Helper commands for version management
```

## Why This Approach?

✅ **Reproducible Builds**: Everyone uses exact same Yarn version
✅ **Zero Setup**: No global Yarn installation needed
✅ **Version Flexibility**: Easy to switch versions without conflicts
✅ **CI/CD Compatible**: Works in Docker and CI environments
✅ **Zero Configuration**: Corepack handles everything automatically

## Updating Yarn

### Quick Method (Recommended)

From the **host machine** (outside Docker):

```bash
make yarn-upgrade VERSION=4.15.0
```

Compatible alias:

```bash
make yarn upgrade VERSION=4.15.0
```

If `VERSION` is omitted, `make yarn-upgrade` (and the alias) now resolve and use the latest stable Yarn release automatically.

This command will:
1. Update `package.json` with the new version
2. Use Corepack to prepare and activate the new version
3. Verify the upgrade was successful

### Manual Method (Inside Docker)

If you prefer to do it manually:

```bash
# Get inside Docker container
make bash

# Update package.json
npm pkg set packageManager="yarn@4.15.0"

# Activate the new version with Corepack
corepack prepare "yarn@4.15.0" --activate

# Verify
yarn --version
```

### Local Machine (Without Docker)

```bash
# Make sure Corepack is enabled
npm install -g corepack

# Update version
npm pkg set packageManager="yarn@4.15.0"

# Activate
corepack prepare "yarn@4.15.0" --activate
corepack enable

# Verify
yarn --version
```

## Checking Current Version

### Display Version Information

```bash
# From host
docker compose exec node make yarn-status

# Or inside Docker
make yarn-status
```

### Dry-Run Upgrade Check (No Changes)

```bash
# From host
docker compose exec node make yarn-upgrade-check

# Or inside Docker
make yarn-upgrade-check
```

This reports current configured/active/latest versions and prints the exact upgrade command to run, without modifying files.

This will show:
- Configured version in `package.json`
- Currently active Yarn version
- Latest stable Yarn Berry release version (fetched from GitHub API)
- Whether an update is available (`yes`/`no`/`unknown`)
- `.yarnrc.yml` yarnPath setting
- Available pre-cached Yarn releases

### Manual Check

```bash
# Configured version (from package.json)
node -p "require('./package.json').packageManager"

# Active version
yarn --version

# Check yarnrc.yml
cat .yarnrc.yml | grep yarnPath
```

## What Gets Updated in the Repository

When you upgrade Yarn:

### Files That Change

1. **package.json** (line 16)
   ```json
   "packageManager": "yarn@4.14.1" → "packageManager": "yarn@4.15.0"
   ```

2. **.yarnrc.yml** (line 8) - Auto-updated by Corepack
   ```yaml
   yarnPath: .yarn/releases/yarn-4.14.1.cjs → yarnPath: .yarn/releases/yarn-4.15.0.cjs
   ```

3. **.yarn/releases/** - New binary cached (Git-tracked)
   ```
   .yarn/releases/yarn-4.15.0.cjs ← New file added
   ```

### Files That Do NOT Change

- `yarn.lock` - Remains unchanged (dependencies unchanged)
- `node_modules/` - Only regenerated if `yarn install` is run
- `docker-entrypoint-dev.sh` - Works with any Yarn version
- `Dockerfile` - Dynamically reads from `package.json`

## Workflow for Upgrading Yarn

### Step 1: Test Locally

```bash
# Inside Docker container
make yarn-status  # Check current

make yarn-upgrade VERSION=4.15.0  # Upgrade

make yarn-status  # Verify new version
```

### Step 2: Verify Everything Works

```bash
# Test that Yarn still works
yarn install

# Run linting
make lint

# Run tests (optional but recommended)
make test
```

### Step 3: Commit Changes

```bash
git add package.json .yarnrc.yml .yarn/releases/yarn-4.15.0.cjs

git commit -m "chore: upgrade Yarn to 4.15.0"

git push
```

### Step 4: Update Docker (if needed)

Usually not needed, but if using pre-built Docker images:

```bash
# Rebuild containers with new Yarn
make start-build
```

## Troubleshooting

### "Command not found: yarn"

**Problem**: Corepack isn't enabled

**Solution**:
```bash
npm install -g corepack
corepack enable
```

### ".yarnrc.yml not updated after version change"

**Problem**: Old version cached

**Solution**:
```bash
# Clear Corepack cache and re-prepare
rm -rf ~/.cache/corepack
npm pkg set packageManager="yarn@X.Y.Z"
corepack prepare "yarn@X.Y.Z" --activate
```

### "Different Yarn versions in different environments"

**Cause**: Someone didn't pull latest `package.json` changes

**Solution**: Always pull before starting work, commit version changes together

### "Yarn install fails after upgrade"

**Problem**: Incompatible with lockfile format

**Solution**: This is rare. If it happens:
```bash
# Regenerate lockfile
rm yarn.lock
yarn install
```

## Checking for Available Yarn Updates

```bash
# See latest Yarn releases
npm view yarn versions --json | tail -20

# Or visit https://registry.npmjs.org/yarn
```

## Version History

Current: **yarn@4.14.1**

To check previous versions:
```bash
# Inside Docker
ls -la .yarn/releases/
```

## CI/CD Considerations

The setup automatically handles:

- ✅ GitHub Actions CI runners
- ✅ Docker builds
- ✅ Local development
- ✅ Team development consistency

**No additional configuration needed** - Corepack reads from `package.json` automatically.

## Best Practices

1. **Update Yarn in dedicated PRs** - Don't mix with feature changes
2. **Test thoroughly** - Run tests after upgrading
3. **Commit all three files** - `package.json`, `.yarnrc.yml`, and new binary
4. **Commit as team** - Ensure everyone pulls new version
5. **Use Makefile targets** - Reduces chance of errors
6. **Document breaking changes** - If Yarn upgrade changes behavior

## Useful Commands Reference

```bash
# Check Yarn version
make yarn-status

# Upgrade Yarn
make yarn-upgrade VERSION=4.15.0

# Inside Docker only - see live version
yarn --version

# See configured version in package.json
node -p "require('./package.json').packageManager"

# Force Corepack to use installed version
corepack enable

# Update dependencies (not Yarn itself)
yarn upgrade-interactive
```

## Further Reading

- [Corepack Documentation](https://nodejs.org/docs/latest/api/corepack.html)
- [Yarn Official Releases](https://github.com/yarnpkg/yarn/releases)
- [npm pkg Command](https://docs.npmjs.com/cli/v10/commands/npm-pkg)

---

*For questions or issues, refer to the main [README.md](./README.md) or project [CLAUDE.md](../CLAUDE.md)*

