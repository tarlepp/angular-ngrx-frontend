# What is this?

This document describes how to maintain SHA-pinned GitHub Actions in this
project.

All GitHub Actions in this repository are pinned to commit SHAs (not version
tags) to reduce supply-chain risk.

## Table of Contents

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Overview](#overview)
  * [Current Action Pins](#current-action-pins)
  * [How to Update Actions](#how-to-update-actions)
  * [Checking for Updates](#checking-for-updates)
  * [Testing Updates](#testing-updates)
  * [Understanding SHA Pins](#understanding-sha-pins)

---

## Overview

This project uses GitHub Actions pinned to specific commit SHAs instead of version tags. This provides:

- ✅ **Security**: Prevents compromised tags or tag updates from affecting CI
- ✅ **Reproducibility**: Same action code runs every time
- ✅ **Auditability**: Easy to track exactly which code is running
- ⚠️ **Maintenance**: Requires manual updates (Dependabot can help, but SHAs must be verified)

### Workflows with Pinned Actions

- `.github/workflows/main.yml` - CI checks (linting, tests, builds)
- `.github/workflows/codeql-analysis.yml` - CodeQL security scanning
- `.github/workflows/scorecard.yml` - Supply-chain security scoring
- `.github/workflows/vulnerability-scan.yml` - Container vulnerability scanning

---

## Current Action Pins

This list is generated from `.github/workflows/*.yml` to avoid stale manual
tables.

Run this command to print current pins as markdown:

```bash
bash scripts/check-action-updates.sh --current-pins-md
```

If you are on the host machine, run the command inside the dev container
(`make bash`) or from your Dev Container terminal.

---

## How to Update Actions

### Step 1: Identify the Action to Update

Check which version is currently pinned in the workflow files. For example:

```yaml
uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
```

The comment shows the version tag, while the SHA is before the comment.

### Step 2: Get the New Commit SHA

Use one of these methods to find the SHA for a new version:

#### Method A: Using git ls-remote (Recommended)

```bash
# Get SHA for a specific version tag
git ls-remote --tags https://github.com/actions/checkout.git refs/tags/v6.0.3 | awk '{print $1}'
```

#### Method B: Using GitHub CLI

```bash
# If you have GitHub CLI installed
gh api repos/actions/checkout/git/refs/tags/v6.0.3 --jq '.object.sha'
```

#### Method C: Using curl + jq

```bash
# Get the latest release information
curl -s https://api.github.com/repos/actions/checkout/releases/latest | \
  jq '.target_commitish'
```

### Step 3: Update the Workflow Files

Update all occurrences of the action in the relevant workflow files. For example, to update `actions/checkout` from v6.0.2 to v6.0.3:

**Before:**
```yaml
uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
```

**After:**
```yaml
uses: actions/checkout@ABC123DEF456... # v6.0.3
```

Make sure to:
- Update ALL occurrences of that action across workflows
- Keep the version tag in the comment
- Use the exact SHA (full 40-character hash)

### Step 4: Verify the Update

Ensure you replaced all instances:

```bash
# Search for old version
grep -r "v6.0.2" .github/workflows/

# Verify new version is in place
grep -r "v6.0.3" .github/workflows/
```

### Step 5: Create a Pull Request

1. Create a branch: `git checkout -b chore/update-github-actions`
2. Commit changes: `git add .github/workflows/*.yml && git commit -m "chore: update GitHub Actions to latest versions"`
3. Push and create a PR
4. Verify CI passes with the new action versions
5. Merge after approval

---

## Checking for Updates

### Method 1: Automated with Dependabot

Dependabot can notify you of action updates. However, you must manually verify and update the SHAs.

**Note**: Dependabot automatically updates version tags but NOT commit SHAs. You need to:
1. See Dependabot PR suggests new version
2. Get the SHA for that version
3. Manually update the SHA in the workflows

### Method 2: Using the Automated Check Script (Recommended)

This repository includes a script that checks pinned actions for updates.

**Location:** `scripts/check-action-updates.sh`

**Run it with (preferred):**
```bash
make check-action-updates
```

If you are already inside the dev container:
```bash
bash scripts/check-action-updates.sh
```

**What it does:**
- Discovers pinned actions dynamically from `.github/workflows/*.yml`
- Compares against the latest compatible release in the same major version line
- Retrieves the full commit SHA for each new version
- Shows colored output (green = current, red = update available)
- Displays summary statistics
- Reports discovery issues (for example unpinned refs or conflicting versions)

**Example output:**
```
=================================================================================
                  GitHub Actions Update Checker
=================================================================================

Checking 7 GitHub Actions for updates...

✓ actions/checkout
   Version: v6.0.2 (up-to-date)

⚠️  UPDATE AVAILABLE: actions/setup-node
   Current: v6.3.0
   Latest:  v6.3.1
   SHA:     53b83947abc123def456...
   Short:   53b83947

...

=================================================================================
                           Summary
=================================================================================
Total actions checked:   7
Discovery warnings:     0
Up-to-date:             5
Updates available:      2
```

**Exit codes:**
- `0` = no discovery warnings and no updates
- `1` = updates available
- `2` = discovery warnings found (unpinned refs, conflicting versions, or unknown version comments)

**Using in CI/CD:**
The script can be integrated into CI pipelines to periodically check for action updates:

```yaml
# .github/workflows/check-updates.yml
name: Check Action Updates
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
      - run: bash scripts/check-action-updates.sh
```

**Requirements:**
- git
- timeout
- bash

**Important behavior:**
- The script intentionally tracks the latest stable release in the same major version line as the currently pinned action.
- This avoids false positives from alternate release streams. For example, `github/codeql-action` publishes `codeql-bundle-*` releases that are not the same upgrade line as the workflow action itself.
- The script continues running version checks even when discovery warnings are found, so one run shows all findings.
- If you want to move to a new major version, review that upgrade manually instead of relying on the script to suggest it automatically.

**Note:** The script identifies updates but does not apply them. Review the changelog and test before merging.

### Method 3: GitHub's Security Alerts

GitHub will notify you of:
- Dependabot alerts for action updates
- Security vulnerabilities in actions
- Breaking changes in action releases

Check them in: **Repository Settings → Code security & analysis → Dependabot alerts**

---

## Testing Updates

### 1. Test in a Feature Branch

Always test action updates before merging to master:

```bash
git checkout -b test/action-update
# Make your action updates
git push origin test/action-update
# Create PR and verify CI passes
```

### 2. Verify Action Behavior

Check the action's changelog for any behavioral changes:

```bash
# Visit the action's repository
# Example: https://github.com/actions/checkout/releases/tag/v6.0.3
```

### 3. Monitor First Run

After merging:
- Watch the next CI run carefully
- Check workflow logs for any new warnings or errors
- Verify the action behaves as expected

---

## Understanding SHA Pins

### What is a SHA pin?

A SHA (Secure Hash Algorithm) is a cryptographic fingerprint of a specific commit in a repository:

- Version tag (can change or be retagged): `actions/checkout@v6.0.2`
- Commit SHA (immutable): `actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd`

### Why use SHA pins?

**Security Risk of Tags:** `Tag v6.0.2 exists → Action Developer creates commit → Developer resets tag to new commit → Your workflows use different code!`

**Security of SHAs:** `SHA de0fac2e points to specific commit → That commit NEVER changes → Your workflows always use the same code`

### How GitHub Actions Resolves SHAs

GitHub supports both formats:

- Tag: `uses: actions/checkout@v6.0.2`
- SHA: `uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd`
- Short SHA: `uses: actions/checkout@de0fac2e`

---

## Best Practices

**Do:**
- Keep version tag in comments for readability
- Update all instances of an action simultaneously
- Test updates in a feature branch before merging
- Document why you're updating (security fix, new feature, etc.)
- Review the action's changelog before updating
- Use the full 40-character SHA (though 7-8 chars work)

**Don't:**
- Mix version tags and SHAs for the same action
- Update only some instances of an action
- Merge action updates without testing
- Use SHAs from unverified sources
- Ignore breaking changes in action releases

---

## Troubleshooting

### "Action not found" error

If you get this error after updating:

```
Error: Can't find 'node_modules/...' from action
```

**Solution:** The SHA might be incorrect. Verify it:
```bash
git ls-remote --tags https://github.com/actions/setup-node.git \
  refs/tags/v6.3.0 | awk '{print $1}'
```

### Workflows fail with new action

**Diagnose:**
1. Check the action's changelog for breaking changes
2. Look at workflow logs for specific error messages
3. Test locally if possible
4. Check GitHub Actions status page

**Solution:**
- Revert to previous version and investigate
- Create an issue in the action's repository
- Contact the maintainer for support

### SHA not found in repository

**Problem:** You fetched a SHA but it doesn't exist

**Solution:**
```bash
# Make sure you're using the correct repository
git ls-remote https://github.com/OWNER/REPO.git refs/tags/TAG_NAME

# Verify the tag exists
git ls-remote https://github.com/OWNER/REPO.git | grep TAG_NAME
```

---

## Useful Resources

- [GitHub Actions Security Hardening](https://docs.github.com/en/actions/security-guides)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [SLSA Framework (Supply-chain Levels for Software Artifacts)](https://slsa.dev/)
- [Action Marketplace](https://github.com/marketplace?type=actions)

---

## FAQ

**Q: Why not just use version tags?**
A: Version tags can be retagged, compromised, or accidentally deleted. SHAs are immutable.

**Q: Can I automatically update SHAs?**
A: Dependabot can notify you, but you must verify and manually update SHAs for security.

**Q: What if an action releases a security patch?**
A: GitHub will notify you via Dependabot. Follow the update steps to pin the new SHA.

**Q: How often should I update actions?**
A: At minimum, update actions with security fixes immediately. For regular maintenance, check monthly.

**Q: Can I use short SHAs?**
A: Yes, GitHub supports 7+ character short SHAs, but full 40-character SHAs are recommended.

---

## Last Updated

- **Date**: 2026-04-07
- **Updated By**: GitHub Copilot
- **Next Review**: 2026-05-07 (monthly)

See also: `doc/README.md` for the documentation index and `.github/workflows/` for the current action pins.

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)


