# What is this?

This project supports Dev Containers in addition to the existing `make` +
Docker Compose workflow.

The existing workflow is unchanged:

- `make start`
- `make start-build`
- `make bash`

Dev Containers are an extra onboarding option for IDEs that support the
[devcontainer specification](https://containers.dev/).

## Table of Contents

- [What is this?](#what-is-this)
  - [Table of Contents](#table-of-contents)
  - [VS Code](#vs-code)
    - [VS Code troubleshooting](#vs-code-troubleshooting)
  - [JetBrains IDEs](#jetbrains-ides)
  - [What this setup does](#what-this-setup-does)

## VS Code

1. Install the **Dev Containers** extension.
2. Open this repository in VS Code.
3. Run `Dev Containers: Reopen in Container`.
4. Inside the container terminal run:

```bash
make start
```

Optional local production mode inside the Dev Container:

```bash
make start-production
```

You can also run the same commands from `Tasks: Run Task`:

- `Dev Container: Start Angular (dev)`
- `Dev Container: Start Angular (local prod)`

Task definitions are configured directly in
`.devcontainer/devcontainer.json` under `customizations.vscode.tasks`.

If tasks do not appear immediately after opening the Dev Container, run
`Developer: Reload Window` once in VS Code.

Your `~/.ssh` and `~/.gitconfig` are automatically mounted in the container,
so you can use Git and SSH without additional setup.

The IDE will forward port `4200`, after which you can open
`https://localhost:4200` in your browser.

### VS Code troubleshooting

If `https://localhost:4200` does not open:

1. Make sure the app is actually running in the container terminal:

```bash
make start
```

1. Check that container port mapping is active:

```bash
docker compose -f compose.yaml -f .devcontainer/docker-compose.devcontainer.yaml ps
```

You should see `0.0.0.0:4200->4200/tcp` in the `PORTS` column.

1. If VS Code tasks are missing, run `Developer: Reload Window` and retry
   `Tasks: Run Task`.

## JetBrains IDEs

If your JetBrains IDE version supports Dev Containers, open the project
as a Dev Container and select the configuration from
`.devcontainer/devcontainer.json`.

If native Dev Container support is not available in your IDE version, use the
current Docker Compose workflow (`make start`, `make bash`) as the fallback.

Note that `customizations.vscode.tasks` in `.devcontainer/devcontainer.json`
is VS Code-specific. JetBrains IDEs do not use those task definitions, so run
`make start` / `make start-production` directly from the integrated terminal
(or create IDE run configurations).

## What this setup does

- Reuses the existing `compose.yaml` service definitions.
- Applies a Dev Container specific Compose override in
  `.devcontainer/docker-compose.devcontainer.yaml`.
- Publishes port `4200` on `localhost`, so `https://localhost:4200` works
  directly from the host.
- Keeps the container running in idle mode so each developer can start the app
  manually with `make start`.
- Avoids changing the existing host-level development workflow.
