# What is this?

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Angular NgRx powered frontend template project for 
[Symfony Flex Backend](https://github.com/tarlepp/symfony-flex-backend)
or any other backend that is providing similar API.

## Table of Contents

* [What is this](#what-is-this)
   * [Table of Contents](#table-of-contents)
   * [Requirements](#requirements)
      * [Recommendations](#recommendations)
   * [Installation](#installation)
      * [1. Clone repository](#1-clone-repository)
      * [2. Start containers](#2-start-containers)
      * [3. Using application](#3-using-application)
      * [4. Getting shell to container](#4-getting-shell-to-container)
      * [5. Building containers](#5-building-containers)
   * [Resources](#resources)
   * [External links / resources](#external-links--resources)
   * [Authors](#authors)
   * [License](#license)

## Requirements

* [docker-compose](https://docs.docker.com/compose/install/)

### Recommendations

* `*nix platform` - not really requirement, but recommend to use to get 
  `Makefile` support

## Installation

### 1. Clone repository

Use your favorite IDE and get checkout from GitHub or just use following command

```bash
git clone https://github.com/tarlepp/angular-frontend.git
```

### 2. Start containers

For this just run following command:

```bash
make start
```

or without `Makefile` support:

```bash
docker-compose up
```

This command will create one (1) Docker container where your application is
running on development stage.
 
### 3. Using application

By default `make start` command starts Angular application on Docker container
and exposes following port on `localhost`:
 * 4200 (Angular Live Development Server)
 
And this application is usable within your browser on `http://localhost:4200`
address.

Note that this frontend application assumes that your backend is running on 
`http://localhost:8000` address. Also note that _"default"_ 
[backend](https://github.com/tarlepp/symfony-flex-backend)
is running on that address by default.

### 4. Getting shell to container

After you've run `make start` command you can list all running containers with 
`docker ps` command.

And to eg. get shell access inside one of those containers you can run following
shortcut command:

```bash
make bash
```

or without `Makefile` support:

```bash
docker-compose exec node bash
``` 

Where that `node` is that actual container where this backend application is
running.

### 5. Building containers

For time to time you probably need to build containers again. This is something
that you should do always if you have some problems to get containers up and
running. This you can do with following command:

```bash
make start-build
```

or without `Makefile` support:

```bash
docker-compose up --build 
```

## Resources

* [Custom commands](doc/COMMANDS.md)
* [Concepts and features](doc/CONCEPTS_AND_FEATURES.md)
* [Speed problems with application?](doc/SPEED_UP_DOCKER_COMPOSE.md)
* [Tools](doc/TOOLS.md)

## External links / resources

* [Angular](https://angular.io/)
* [Angular Material](https://material.angular.io/)
* [Material Icons](https://material.io/resources/icons/)
* [Angular Flex-Layout](https://github.com/angular/flex-layout)
* [The RxJS Library](https://angular.io/guide/rx-library)
* [NgRx Reactive State for Angular](https://ngrx.io/)
* [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

## Authors

* [Tarmo Leppänen](https://github.com/tarlepp)

## License

[The MIT License (MIT)](LICENSE)

Copyright © 2020 Tarmo Leppänen
