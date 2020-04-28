# What is this?

This document contains all custom commands that you can use within this
application during development stage.

## Table of Contents

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Makefile](#makefile)
  * [Yarn](#yarn)

## Makefile

This project contains `Makefile` configuration so that you can easily run
some generic commands via `make` command. Below is a list of currently
supported make commands, note that you can get this same list with just
running `make` command:

```bash
bash            # Get bash inside Node container
start-build     # Start application in development mode and build containers
start           # Start application in development mode
start-yarn      # Run start command with yarn
stop            # Stop application containers
```

Example:

```bash
da_wunder@wunder-VirtualBox:~/PhpstormProjects/angular-ngrx-frontend$ make bash
node@84a0da4d1c84:/app$
```

## Yarn

This project contains some custom scripts that are defined in [packages.json](../package.json)
file that you can easily run just by using `yarn _command_here_`. Note
that these yarn commands are mean to run inside Docker container, so first
use `make bash` command to get shell inside container.

Below you can see a list of all those custom commands that you most likely
need to use at some point of development process:

```bash
extract-translations    # Extract translations, see TRANSLATIONS.md for detailed information
lint:scss               # Lint all SCSS files using stylelint tool - https://stylelint.io/
lint:ts                 # Lint all TypeScript files using TSLint tool - https://palantir.github.io/tslint/
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
