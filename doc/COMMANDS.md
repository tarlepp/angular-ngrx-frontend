# What is this?

This document contains all custom commands that you can use within this
application during development stage.

## Table of Contents

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Makefile](#makefile-table-of-contents)
  * [Yarn](#yarn-table-of-contents)

## Makefile [ᐞ](#table-of-contents)

This project contains `Makefile` configuration so that you can easily run
some generic commands via `make` command. Below is a list of currently
supported make commands, note that you can get this same list with just
running `make` command:

```bash
bash                      # Get bash inside Node container
check-translations        # Check missing translations
docker-kill-containers    # Kill all running docker containers
docker-remove-containers  # Remove all docker containers
docker-remove-images      # Remove all docker images
extract-translations      # Extract translations from TypeScript and HTML
                          # template files
fish                      # Get fish inside Node container
lint                      # Lint TypeScript and SCSS files
lint-scss                 # Lint SCSS files
lint-ts                   # Lint TypeScript files
start-build               # Start application in development mode and build
                          # containers
start-production          # Start application locally in production mode
start                     # Start application in development mode
start-yarn-prod           # Run start-prod command with yarn
start-yarn                # Run start command with yarn
stop                      # Stop application containers
update                    # Upgrade dependencies via yarn interactively

```

Example:

```bash
da_wunder@wunder-VirtualBox:~/PhpstormProjects/angular-ngrx-frontend$ make bash
node@84a0da4d1c84:/app$
```

## Yarn [ᐞ](#table-of-contents)

This project contains some custom scripts that are defined in [packages.json](../package.json)
file that you can easily run just by using `yarn _command_here_`. Note
that these yarn commands are mean to run inside Docker container, so first
use `make bash` command to get shell inside container.

Below you can see a list of all those custom commands that you most likely
need to use at some point of development process:

```bash
extract-translations    # Extract translations, see TRANSLATIONS.md
lint:scss               # Lint SCSS files by https://stylelint.io/
lint:ts                 # Lint TS files by https://palantir.github.io/tslint/
```

Example:

```bash
da_wunder@wunder-VirtualBox:~/PhpstormProjects/angular-ngrx-frontend$ make bash
node@84a0da4d1c84:/app$ yarn lint:scss
yarn run v1.22.4
$ npx stylelint '**/*.scss'
Done in 2.06s.
node@84a0da4d1c84:/app$
```

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
