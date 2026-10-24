# What is this?

This document contains information about _common_ tools that are included to
this application. All these tools are available inside application docker
container.

## Table of Contents [ᐞ](#table-of-contents)

<a id="table-of-contents"></a>

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [npm-check-updates](#npm-check-updates-table-of-contents)
  * [mversion](#mversion-table-of-contents)
  * [thefuck](#thefuck-table-of-contents)

## npm-check-updates [ᐞ](#table-of-contents)

<a id="npm-check-updates"></a>

npm-check-updates upgrades your package.json dependencies to the latest
versions, ignoring specified versions.

npm-check-updates maintains your existing semantic versioning policies, i.e.,
it will upgrade `"express": "^4.0.0"` to `"express": "^5.0.0"`.

* [Website](https://github.com/tjunnone/npm-check-updates)

## mversion [ᐞ](#table-of-contents)

<a id="mversion"></a>

A cross packaging manager module version handler/bumper. Imitates _npm version_
to also work on other packaging files. For those times you either have
multiple packaging files (like `bower.json`, `component.json`, `manifest.json`)
or just not a `package.json` file. mversion can easily bump your version and
optionally commit and create a tag.

* [Website](https://github.com/mikaelbr/mversion)

## thefuck [ᐞ](#table-of-contents)

<a id="thefuck"></a>

`thefuck` is installed in the development container to provide command
correction aliases for bash and fish.

Interactive Bash and Fish sessions opened with `make bash` or `make fish`
automatically offer a correction after a failed command. Press Enter to
execute the suggestion, use the arrow keys to choose another suggestion,
or press Ctrl+C to dismiss
it. Confirmation is always required for automatic suggestions, even if
disabled in personal `thefuck` settings. Successful commands, commands
interrupted by a signal, and non-interactive scripts do not trigger suggestions.
The Bash prompt hook preserves existing prompt commands; Fish uses its
`fish_postexec` event without replacing the prompt.

Like manual invocation, `thefuck` may rerun the failed command to inspect
its output before suggesting a correction. Be aware of this for commands
that can partially succeed or have side effects.

Manual correction with `fuck` remains available in both shells.

The automatic hooks are installed from `docker/bash/thefuck.bash` and
`docker/fish/config.fish`. After changing either, rebuild and recreate the
container with `make start-build`.

### Python 3.13 compatibility note [ᐞ](#table-of-contents)

<a id="python-313-compatibility-note"></a>

At the moment, `thefuck` `3.32` still imports deprecated Python `imp` from
`thefuck/conf.py` and `thefuck/types.py`. Python `3.13` removed `imp`, which
causes startup tracebacks when shells load `thefuck --alias`.

To keep development shells working, the Docker build applies a small
compatibility patch in `Dockerfile` that replaces `imp.load_source` usage with
an `importlib`-based `load_source` implementation.

This patch should be removed when upstream `thefuck` no longer imports `imp`.
Before removal, verify inside container:

```bash
thefuck --alias >/dev/null
```

* [Website](https://github.com/nvbn/thefuck)

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
