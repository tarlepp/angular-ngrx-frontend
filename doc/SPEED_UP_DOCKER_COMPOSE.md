# What is this?

This document contains information about how you can speed up docker-compos
usage in development stage.

## Table of Contents

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Reasons?](#reasons-table-of-contents)
  * [Environments with problems](#environments-with-problems-table-of-contents)
    * [Windows](#windows-table-of-contents)
    * [Mac](#mac-table-of-contents)
    * [Linux](#linux-table-of-contents)
  * [Installation of docker-sync](#installation-of-docker-sync-table-of-contents)
    * [Configuration](#configuration-table-of-contents)
    * [Startup](#startup-table-of-contents)

## Reasons? [ᐞ](#table-of-contents)

IO traffic is the main reason why using Docker on certain environments
will be quite slow.

## Environments with problems [ᐞ](#table-of-contents)

Basically Windows and Mac; with linux you should not have these problems at all.

### Windows [ᐞ](#table-of-contents)

The "most" clean solution to solve this atm is to run eg. Ubuntu desktop within
[VMware](https://www.vmware.com/) / [VirtualBox](https://www.virtualbox.org/)
machines. And this means that you actually run your favorite IDE inside that
virtual machine.

Another way is to use [docker-sync](#installation-of-docker-sync). Application
itself already contains necessary [docker-sync.yml](../docker-sync.yml)
configuration file to help with this.

### Mac [ᐞ](#table-of-contents)

With Mac there is a bit speed difference versus pure _*inux_ installation, but
you could try to speed that up by using [Docker for Mac Edge](https://docs.docker.com/docker-for-mac/edge-release-notes/)

Some benchmark about `Docker for Mac` versus `Docker for Mac Edge`
[here](https://medium.com/@somwhatparanoid/tweaking-docker-for-mac-performance-for-php-and-symfony-b63f3395a1da)

And if that [Docker for Mac Edge](https://docs.docker.com/docker-for-mac/edge-release-notes/)
isn't fast enough for you, you could also setup that [docker-sync](#installation-of-docker-sync)
for your environment.

### Linux [ᐞ](#table-of-contents)

No need to do anything `¯\_(ツ)_/¯`

## Installation of docker-sync [ᐞ](#table-of-contents)

Follow install instructions from [docker-sync](http://docker-sync.io/)
website.

### Configuration [ᐞ](#table-of-contents)

Create a `compose.override.yaml` file with following content:

```yaml
#
# This file should NOT be added to your VCS, only purpose of this is to
# override those volumes with docker-sync.yml config
#
services:
  node:
    volumes:
      - frontend-code:/app:cached
volumes:
  frontend-code:
    external: true
```

### Startup [ᐞ](#table-of-contents)

To start application you just need to use command;

```bash
docker-sync-stack start
```

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
