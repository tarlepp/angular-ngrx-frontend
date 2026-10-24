# What is this?

This guide describes how to inspect Docker base images and build this
application's image for one or more platforms.

## Table of Contents [ᐞ](#table-of-contents)

<a id="table-of-contents"></a>

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Requirements](#requirements)
  * [Inspecting base images](#inspecting-base-images)
  * [Building for one platform](#building-for-one-platform)
  * [Building and pushing multiple platforms](#building-and-pushing-multiple-platforms)
  * [Maintaining multi-platform base images](#maintaining-multi-platform-base-images)

## Requirements [ᐞ](#table-of-contents)

<a id="requirements"></a>

Run these commands from the repository root on the Docker host, not inside the
development container. The helper requires Docker with the Buildx plugin.
`jq` is additionally required for digest inspection and base-image verification.
Pushing requires authentication to the target registry.

The commands are available through `make` and the underlying
`scripts/docker-images.sh` helper:

```bash
make docker-builder-platforms
make docker-image-verify-pins
```

## Inspecting base images [ᐞ](#table-of-contents)

<a id="inspecting-base-images"></a>

Show the digest, media type, and supported platforms for an image:

```bash
make docker-image-digest IMAGE=node:26.10.0-trixie
```

`make docker-image-verify-pins` checks external `FROM` images in the root
Dockerfile and any Dockerfiles under `docker/`. It verifies that each resolves
to a multi-platform index; single-platform manifests fail verification.
Multi-platform tags that are not pinned by digest produce warnings. Use the
digest command to get a pin reference.

## Building for one platform [ᐞ](#table-of-contents)

<a id="building-for-one-platform"></a>

Build and load a single-platform image into the local Docker image store:

```bash
make docker-build-platform \
  PLATFORM=linux/arm64 \
  DOCKERFILE=Dockerfile \
  TARGET=production \
  TAG=angular-ngrx-frontend:arm64
```

The helper prompts for omitted values. Its defaults use `Dockerfile`, the last
build stage, and an architecture-specific `angular-ngrx-frontend` tag.

## Building and pushing multiple platforms [ᐞ](#table-of-contents)

<a id="building-and-pushing-multiple-platforms"></a>

Build a manifest list for multiple platforms and push it to a registry:

```bash
make docker-build-multi-platform \
  PLATFORMS=linux/amd64,linux/arm64 \
  DOCKERFILE=Dockerfile \
  TARGET=production \
  TAG=ghcr.io/OWNER/angular-ngrx-frontend:latest \
  BUILDER=multi-platform
```

The helper requests confirmation before pushing. If the named Buildx builder
does not exist, it creates a `docker-container` builder. Check builder
capabilities with `make docker-builder-platforms`. Some hosts may need QEMU
emulation registered first:

```bash
make docker-setup-qemu PLATFORMS=arm64,amd64
```

QEMU setup runs a privileged container and asks for confirmation.

## Maintaining multi-platform base images [ᐞ](#table-of-contents)

<a id="maintaining-multi-platform-base-images"></a>

When changing a Dockerfile base image, verify that its selected tag or digest
resolves to an image index containing the platforms this project supports.
Prefer a digest pin from `make docker-image-digest IMAGE=...`; use the index
digest, not a platform-specific child manifest digest. After updating a
Dockerfile, run `make docker-image-verify-pins` from the Docker host.

The root Dockerfile pins the Node dependency and development images and the
nginx production image to multi-platform index digests. Keep the Node versions
aligned between those stages and retain the explicit Debian variant when
updating them. Check the nginx image's Alpine package versions before changing
its tag or digest, since the production stage also pins runtime packages.

The existing GitHub Actions workflow builds an image for its runner's platform;
the helper's multi-platform push command is a manual publishing tool and does
not change CI publishing behavior.

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
