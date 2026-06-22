# What is this?

[![MIT licensed][badge-mit]][license-url]
![CI][badge-ci]
[![OpenSSF Scorecard][badge-openssf]][openssf-url]

Angular NgRx powered frontend template project for
[Symfony Flex Backend](https://github.com/tarlepp/symfony-flex-backend)
or any other backend that is providing similar API.

This application is meant to be used as a standalone SPA frontend that consumes
REST APIs. The default target backend for local development is
[`symfony-flex-backend`](https://github.com/tarlepp/symfony-flex-backend), but
you can use any backend that provides a compatible API.

## Quick Start

```bash
git clone https://github.com/tarlepp/angular-ngrx-frontend.git
cd angular-ngrx-frontend
make start
```

Then open `https://localhost:4200` in your browser. For more details, see
[Installation](#installation).

## Table of Contents

* [What is this](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Requirements](#requirements)
    * [Recommendations](#recommendations)
  * [Installation](#installation)
    * [1. Clone repository](#1-clone-repository)
    * [2. Start containers](#2-start-containers)
  * [Running the application](#running-the-application)
    * [Using application](#using-application)
    * [Getting shell to container](#getting-shell-to-container)
    * [Building containers](#building-containers)
    * [Health check](#health-check)
  * [Dev Containers](#dev-containers)
  * [AI-assisted development](#ai-assisted-development)
  * [Backend?](#backend)
* [Resources](#resources)
  * [External links / resources](#external-links--resources)
  * [Authors](#authors)
  * [License](#license)

## Requirements

* [Docker Engine](https://docs.docker.com/engine/install/)
* [Docker Compose v2](https://docs.docker.com/compose/install/)
  (included with Docker Desktop)

### Recommendations

* `*nix platform` - most likely you're going to host your application on *nix
  platform - so I would recommend to do development also on that platform.
* `WSL2 on Windows` - if you develop on Windows, use WSL2 to get a Linux-like
  development environment for Docker and tooling.
* `Dev Container capable IDE` - recommended for the quickest setup (e.g. VS Code
  or JetBrains IDEs with Dev Container support).
* `Makefile` support - recommended if you run containers with Make commands;
  if you do not have `make`, check `Makefile` to see equivalent Docker
  commands.

### Package manager

This repository is pinned to Yarn 4 via the `packageManager` field in
`package.json` and a checked-in release file under `.yarn/releases/`.

When running commands inside the Docker `node` container (or in a Dev Container
terminal), use `yarn` directly from the project root so the pinned Yarn version
is used automatically.

## Installation

This installation guide expects that you're using Docker Engine.

### 1. Clone repository

Use your favorite IDE and check out the repository from GitHub, or use the
following command:

```bash
git clone https://github.com/tarlepp/angular-ngrx-frontend.git
```

### 2. Start containers

You can run this project either with Dev Containers (for example in VS Code or
JetBrains IDEs) or with Make commands.

For Dev Containers, open this repository in your IDE and use its Dev Container
workflow to reopen/start the project in a container (see
[Dev Containers](#dev-containers) section for details).

If you want to use Make commands instead, choose one of the following:

```bash
make start            # Standard start – runs `yarn install` on each startup
make start-immutable  # Strict start – runs `yarn install --immutable` on each startup
```

Both commands create one (1) Docker container where your application is running
on development stage. Use `make start-immutable` when you want to enforce
lockfile-consistent dependency installation (the container entrypoint runs
`yarn install --immutable` instead of `yarn install`).

For next steps (application URL, shell access, rebuilding containers, and a
quick health check), see [Running the application](#running-the-application).

## Running the application

These instructions are shared for both Make-based and Dev Container-based
workflows.

### Using application

By default `make start` starts the Angular development server inside the Docker
container and exposes the following port on `localhost` on your host machine
(note that the application is using HTTPS):

* angular-ngrx-frontend - [https://localhost:4200](https://localhost:4200)
  (Angular Live Development Server)

And this application is usable in your browser at `https://localhost:4200`.
When you open that site for the first time, you will see a "Your connection is
not private" warning - see [this](./docker/ssl/README.md) to resolve that.

Note that this frontend application assumes that your backend is running on
`https://localhost:8000` address. Also note that _"default"_
[backend](https://github.com/tarlepp/symfony-flex-backend)
is running on that address by default.

### Getting shell to container

After you've started the container (`make start` or via Dev Containers), you
can list all running containers with `docker ps`.

To get shell access inside the container, run the following command:

```bash
make bash
```

If you are using Dev Containers, you can also use the IDE terminal that is
already attached to the `node` container.

### Building containers

From time to time you probably need to build containers again. This is something
that you should do every time if you have some problems getting containers up
and running.

If you use Make commands, rebuild/start the development container with:

```bash
make start-build
```

If you want to start the application locally with the production-like Angular
configuration, use:

```bash
make start-production
```

If you use Dev Containers, use your IDE's Dev Container rebuild action (for
example, "Rebuild Container" / "Rebuild and Reopen in Container").

### Health check

To verify your setup is working correctly, you can check:

```bash
# Check container status
docker compose ps

# Test HTTPS endpoint (ignore SSL warning)
curl -k -I https://localhost:4200
```

## Dev Containers

This project also supports opening the repository directly in a Dev Container
for IDE workflows.

* VS Code: use `Dev Containers: Reopen in Container`.
* JetBrains IDEs: open the project using Dev Container support if available in
  your IDE version.

When using a Dev Container, start the Angular development server inside the
container and use the IDE forwarded port for `https://localhost:4200`.

Quick start inside the Dev Container:

```bash
make start
```

To confirm the pinned package manager inside the container:

```bash
yarn --version
yarn install --immutable
```

In VS Code, you can run the same command via `Tasks: Run Task` using
`Dev Container: Start Angular (dev)`.

For local production mode inside the Dev Container, use:

```bash
make start-production
```

Task definitions are maintained in `.devcontainer/devcontainer.json`.

Those task definitions are VS Code-specific (`customizations.vscode.tasks`).
In JetBrains IDEs, run `make start` / `make start-production` from the
integrated terminal.

This support is additive; the existing `make start`, `make start-build`, and
`make bash` workflow remains unchanged.

See [Dev Containers](doc/DEV_CONTAINERS.md) for detailed steps.

## AI-assisted development

If you use AI assistance in this repository, keep it aligned with the project
conventions already documented in this order:

* `.github/copilot-instructions.md` for short repository rules,
* `CLAUDE.md` for broader architecture and workflow context,
* `doc/AI_RULES.md` for how AI guidance is maintained over time, and
* `.github/pull_request_template.md` for the human review checklist used in
  pull requests.

As a simple rule of thumb, update the AI guidance when the same review comment,
architectural correction, or project convention appears repeatedly and should
become a repository default.

When possible, validate AI-assisted changes with the smallest relevant command
set from project root inside the running development container:

```bash
yarn lint:ts
yarn lint:scss
yarn test
yarn extract-translations
yarn check-translations
```

In the documented local development workflow, run those commands inside the
running `node` development container or Dev Container where the pinned Yarn
toolchain is available.

## Backend?

This frontend template is designed to work especially well with the
[`symfony-flex-backend`](https://github.com/tarlepp/symfony-flex-backend)
project, but it can be used with any backend that exposes a compatible REST
API.

If you want a ready-made backend pair for this frontend, start with the Symfony
Flex Backend project. It includes the API, authentication flow, and Docker-based
development environment that this frontend expects by default.

## Resources

* [Resource index](doc/README.md)
* [AI-assisted change policy](doc/AI_RULES.md)
* [Custom commands](doc/COMMANDS.md)
* [GitHub Actions update guide](doc/ACTIONS_UPDATE.md)
* [Concepts and features](doc/CONCEPTS_AND_FEATURES.md)
* [Dependency update](doc/DEPENDENCY_UPDATE.md)
* [Dev Containers](doc/DEV_CONTAINERS.md)
* [Speed problems with application?](doc/SPEED_UP_DOCKER_COMPOSE.md)
* [Tools](doc/TOOLS.md)
* [Translations](doc/TRANSLATIONS.md)
* [Usage checklist](doc/USAGE_CHECKLIST.md)
* [Yarn version management](doc/YARN_UPDATE.md)
* [Yarn update quick reference](doc/YARN_UPDATE_QUICK_REF.md)
* [Scripts](scripts/README.md)

## External links / resources

* [Angular](https://angular.io/)
* [Angular Material](https://material.angular.io/)
* [Material Icons](https://material.io/resources/icons/)
* [Angular Flex-Layout](https://github.com/angular/flex-layout)
* [The RxJS Library](https://angular.io/guide/rx-library)
* [NgRx Reactive State for Angular](https://ngrx.io/)
* [Redux DevTools][redux-devtools-url]

[badge-mit]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
[badge-ci]:
https://github.com/tarlepp/angular-ngrx-frontend/workflows/CI/badge.svg
[badge-openssf]:
https://api.securityscorecards.dev/projects/github.com/tarlepp/angular-ngrx-frontend/badge
[openssf-url]:
https://securityscorecards.dev/viewer/?platform=github.com&org=tarlepp&repo=angular-ngrx-frontend
[redux-devtools-url]:
https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd

## Authors

* [Tarmo Leppänen](https://github.com/tarlepp)

## License

[The MIT License (MIT)](LICENSE)

Copyright © 2024 Tarmo Leppänen
