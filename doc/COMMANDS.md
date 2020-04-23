# What is this?

This document contains all custom commands that you can use within this
application during development stage.

## Table of Contents

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Makefile](#makefile)

## Makefile

This project contains `Makefile` configuration so that you can easily run
some generic commands via `make` command. Below is a list of currently
supported make commands, note that you can get this same list with just
running `make` command:

```bash
bash                 # Get bash inside Node container
start-build          # Start application in development mode and build containers
start                # Start application in development mode
start-yarn           # Run start command with yarn
stop                 # Stop application containers
```
