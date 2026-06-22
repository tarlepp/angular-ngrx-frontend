# What is this?

This document describes the most useful development commands for this project.

The primary workflow is Docker-based and exposed through `make` targets.
If you are working inside a Dev Container, you can run the equivalent `yarn`
commands directly from the IDE terminal.

## Table of Contents

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Recommended workflow](#recommended-workflow)
  * [Make commands](#make-commands)
    * [Container lifecycle](#container-lifecycle)
    * [Shell access](#shell-access)
    * [Linting and fixing](#linting-and-fixing)
    * [Translations](#translations)
    * [Maintenance utilities](#maintenance-utilities)
  * [Yarn commands](#yarn-commands)
  * [Examples](#examples)

## Recommended workflow

For most users, these are the commands you will use most often:

```bash
make start
make bash
make lint
make fix
make stop
```

If you are using a Dev Container, open the project in the container and run the
same underlying tasks with `yarn` where appropriate.

## Make commands

Run `make` without arguments to see the current help output.

### Container lifecycle

```bash
make start               # Start application in development mode
make start-immutable     # Start development mode with `yarn install --immutable` in container entrypoint
make start-build         # Start application in development mode and rebuild container
make start-production    # Start application with the local production Angular configuration
make start-yarn          # Run `yarn start` inside the running container
make start-yarn-prod     # Run `yarn start-prod` inside the running container
make stop                # Stop application containers
```

### Shell access

```bash
make bash               # Open a bash shell inside the node container
make fish               # Open a fish shell inside the node container
```

### Linting and fixing

```bash
make lint               # Run TypeScript, SCSS, and Markdown linting
make lint-ts            # Run Angular/TypeScript linting
make lint-scss          # Run SCSS linting with stylelint
make lint-md            # Run markdownlint for all tracked Markdown files
make fix                # Run TypeScript, SCSS, and Markdown auto-fixes
make fix-ts             # Run Angular/TypeScript lint fixes
make fix-scss           # Run SCSS auto-fixes with stylelint
make fix-md             # Run markdownlint auto fixes for tracked Markdown files
```

### Translations

```bash
make extract-translations   # Extract translation keys from TS and HTML templates
make check-translations     # Check for missing or out-of-sync translations
```

### Maintenance utilities

```bash
make update                    # Upgrade dependencies interactively with yarn
make generate-ssl-cert         # Generate self-signed SSL certificates for local development
make check-action-updates      # Check pinned GitHub Actions and available updates
make project-stats             # Generate simple project statistics
make docker-kill-containers    # Kill all running Docker containers on the host
make docker-remove-containers  # Remove all Docker containers on the host
make docker-remove-images      # Remove all Docker images on the host
```

## Yarn commands

The project defines scripts in [`package.json`](../package.json). These are
especially useful when you are already inside the container via `make bash`, or
when working in a Dev Container terminal.

This repository is pinned to Yarn 4. The project-managed release file is stored
under `.yarn/releases/`, so running `yarn` in the project root automatically
uses the pinned version.

Recommended verification after container startup:

```bash
yarn --version
yarn install --immutable
```

Commonly used scripts:

```bash
yarn install --immutable    # Install dependencies exactly as declared in yarn.lock
yarn start                # Start Angular development server with local SSL certificates
yarn start-prod           # Start Angular using the local production configuration
yarn build                # Create a development build
yarn build-prod           # Create a production build
yarn test                 # Run unit tests
yarn lint:ts              # Run Angular/TypeScript linting
yarn lint:scss            # Run stylelint for SCSS files
yarn lint:md              # Run markdownlint for all tracked Markdown files
yarn fix:ts               # Auto-fix Angular/TypeScript lint issues
yarn fix:scss             # Auto-fix SCSS lint issues
yarn fix:md               # Auto-fix markdownlint issues in tracked Markdown files
yarn extract-translations # Extract translation keys
yarn check-translations   # Validate translation files
yarn i18n:extract         # Run Transloco key extraction
yarn i18n:find            # Find translation key usage
yarn e2e                  # Run end-to-end tests
yarn up -i                # Interactively update dependency versions (Yarn 4)
```

## Examples

Open a shell in the running container:

```bash
make bash
```

Run SCSS linting inside the container:

```bash
make bash
yarn lint:scss
```

Run the full lint suite from the host using the running container:

```bash
make lint
```

Check pinned GitHub Actions and available updates:

```bash
make check-action-updates
```

Print current GitHub Action pins as markdown:

```bash
make bash
bash scripts/check-action-updates.sh --current-pins-md
```

Rebuild and restart the development container:

```bash
make start-build
```

Start development mode with immutable dependency install:

```bash
make start-immutable
```

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
