# What is this?

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![CI](https://github.com/tarlepp/angular-ngrx-frontend/workflows/CI/badge.svg)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/tarlepp/angular-ngrx-frontend/badge)](https://securityscorecards.dev/viewer/?platform=github.com&org=tarlepp&repo=angular-ngrx-frontend)

Angular NgRx powered frontend template project for
[Symfony Flex Backend](https://github.com/tarlepp/symfony-flex-backend)
or any other backend that is providing similar API.

## Table of Contents

* [What is this](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Requirements](#requirements-table-of-contents)
    * [Recommendations](#recommendations-table-of-contents)
  * [Installation](#installation-table-of-contents)
    * [1. Clone repository](#1-clone-repository-table-of-contents)
    * [2. Start containers](#2-start-containers-table-of-contents)
    * [3. Using application](#3-using-application-table-of-contents)
    * [4. Getting shell to container](#4-getting-shell-to-container-table-of-contents)
    * [5. Building containers](#5-building-containers-table-of-contents)
  * [Resources](#resources-table-of-contents)
  * [External links / resources](#external-links--resources-table-of-contents)
  * [Authors](#authors-table-of-contents)
  * [License](#license-table-of-contents)

## Requirements [ᐞ](#table-of-contents)

* [Docker Engine](https://docs.docker.com/engine/install/)

### Recommendations [ᐞ](#table-of-contents)

* `*nix platform` - most likely you're going to host your application on *nix
  platform - so I would recommend to do development also on that platform.
* `Makefile` support - if you don't have this you need to look `Makefile` file
  to see what each `make` command is doing.

## Installation [ᐞ](#table-of-contents)

### 1. Clone repository [ᐞ](#table-of-contents)

Use your favorite IDE and get checkout from GitHub or just use following command

```bash
git clone https://github.com/tarlepp/angular-frontend.git
```

### 2. Start containers [ᐞ](#table-of-contents)

For this just run following command:

```bash
make start
```

This command will create one (1) Docker container where your application is
running on development stage.

### 3. Using application [ᐞ](#table-of-contents)

By default `make start` command starts Angular application on Docker container
and exposes following port on `localhost` (note that application is using
https):

* 4200 (Angular Live Development Server)

And this application is usable within your browser on `https://localhost:4200`
address. When you first time open that site you will see "Your connection is
not private" warning - see [this](./docker/ssl/README.md) to resolve that.

Note that this frontend application assumes that your backend is running on
`https://localhost:8000` address. Also note that _"default"_
[backend](https://github.com/tarlepp/symfony-flex-backend)
is running on that address by default.

### 4. Getting shell to container [ᐞ](#table-of-contents)

After you've run `make start` command you can list all running containers with
`docker ps` command.

And to e.g. get shell access inside one of those containers you can run following
shortcut command:

```bash
make bash
```

Where that `node` is that actual container where this backend application is
running.

### 5. Building containers [ᐞ](#table-of-contents)

From time to time you probably need to build containers again. This is something
that you should do always if you have some problems to get containers up and
running. This you can do with following command:

```bash
make start-build
```

## Resources [ᐞ](#table-of-contents)

* [Resource index](doc/README.md)
* [Custom commands](doc/COMMANDS.md)
* [Concepts and features](doc/CONCEPTS_AND_FEATURES.md)
* [Dependency update](doc/DEPENDENCY_UPDATE.md)
* [Speed problems with application?](doc/SPEED_UP_DOCKER_COMPOSE.md)
* [Tools](doc/TOOLS.md)
* [Translations](doc/TRANSLATIONS.md)
* [Usage checklist](doc/USAGE_CHECKLIST.md)
* [Scripts](scripts/README.md)

## External links / resources [ᐞ](#table-of-contents)

* [Angular](https://angular.io/)
* [Angular Material](https://material.angular.io/)
* [Material Icons](https://material.io/resources/icons/)
* [Angular Flex-Layout](https://github.com/angular/flex-layout)
* [The RxJS Library](https://angular.io/guide/rx-library)
* [NgRx Reactive State for Angular](https://ngrx.io/)
* [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

## Authors [ᐞ](#table-of-contents)

* [Tarmo Leppänen](https://github.com/tarlepp)

## License [ᐞ](#table-of-contents)

[The MIT License (MIT)](LICENSE)

Copyright © 2024 Tarmo Leppänen
