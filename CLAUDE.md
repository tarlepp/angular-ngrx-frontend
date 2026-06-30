# What is this?

> **Project**: Angular NgRx Frontend Template
> **Author**: Tarmo Leppänen
> **License**: MIT
> **Last Updated**: June 2026

This `CLAUDE.md` file is the long-form AI and contributor context guide for
this repository. It explains architecture, workflow, and project conventions so
changes stay aligned with existing Angular, NgRx, and CI expectations.

Use this document for deeper context, while keeping
`.github/copilot-instructions.md` as the short operational rules source.

## Table of Contents

- [What is this](#what-is-this)
  - [Table of Contents](#table-of-contents)
  - [AI documentation map](#ai-documentation-map)
  - [Key characteristics](#key-characteristics)
  - [Version sources of truth](#version-sources-of-truth)
  - [Project structure](#project-structure)
  - [Technology stack](#technology-stack)
  - [Architecture patterns](#architecture-patterns)
  - [Development workflow](#development-workflow)
  - [Common tasks](#common-tasks)
  - [CI and validation](#ci-and-validation)
  - [Configuration](#configuration)
  - [Key conventions](#key-conventions)
  - [Backend integration](#backend-integration)
  - [Testing strategy](#testing-strategy)
  - [Common issues and notes](#common-issues-and-notes)
  - [Practical guidance for AI assistants](#practical-guidance-for-ai-assistants)

## AI documentation map

Use the repository AI guidance in this order:

1. `.github/copilot-instructions.md` - short repository-level operational rules
2. `CLAUDE.md` - long-form project context, architecture, and workflow notes
3. `doc/AI_RULES.md` - AI policy maintenance and CI strategy guidance
4. `.github/pull_request_template.md` - human review checklist for pull requests

If one of these documents drifts from the implementation, prefer the actual
repository code, scripts, and CI configuration as the source of truth.

## Key characteristics

- **Framework**: Angular with standalone components
- **State management**: NgRx
- **Language**: TypeScript with strict compiler settings
- **UI**: Angular Material with SCSS styling
- **Layout**: `@ngbracket/ngx-layout`
- **i18n**: Transloco via `@jsverse/transloco`
- **Authentication**: JWT-based authentication with `@auth0/angular-jwt`
- **Testing**: Karma + Jasmine for unit tests, Protractor still present for E2E
- **Package manager**: Yarn via Corepack
- **Container runtime**: pinned Node versions in Docker and CI

## Version sources of truth

To avoid documentation drift, this file intentionally avoids mirroring most
exact dependency and tooling versions.

For current versions, use these files as the source of truth:

- `package.json` for Angular, NgRx, TypeScript, Yarn package manager, and most
  frontend dependencies
- `Dockerfile` for container Node.js versions
- `.github/actions/setup-yarn/action.yml` for the CI Node.js version and Yarn
  installation behavior
- `angular.json` for Angular workspace targets and build/test/lint setup

If a version matters for implementation, read it from those files instead of
copying it into long-form documentation.

## Project structure

```text
angular-ngrx-frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.routes.ts
│   │   ├── auth/
│   │   ├── landing/
│   │   ├── shared/
│   │   └── store/
│   ├── assets/
│   │   ├── config/
│   │   ├── i18n/
│   │   └── version.json
│   ├── environments/
│   └── styles/
├── .github/
│   ├── actions/
│   └── workflows/
├── .devcontainer/
├── docker/
├── doc/
├── e2e/
└── scripts/
```

## Technology stack

### Core dependencies

- Angular
- Angular Material
- NgRx
  - `@ngrx/store`
  - `@ngrx/effects`
  - `@ngrx/entity`
  - `@ngrx/operators`
  - `@ngrx/router-store`
  - `@ngrx/store-devtools`
- RxJS
- `@jsverse/transloco`
- `@jsverse/transloco-keys-manager`
- `@ngbracket/ngx-layout`
- `@auth0/angular-jwt`
- Luxon and `luxon-angular`
- `ngx-webstorage`
- `ngrx-store-localstorage`

### Development tooling

- TypeScript
- ESLint
- `@angular-eslint`
- `@ngrx/eslint-plugin`
- `@typescript-eslint`
- Stylelint
- Angular CLI
- Karma + Jasmine
- Protractor
- Docker + Docker Compose
- Dev Container support via `.devcontainer/devcontainer.json`

## Architecture patterns

### 1. Angular application structure

- Use standalone components; do not introduce NgModules.
- Keep code within the existing feature-based structure under `src/app/`.
- Prefer existing shared building blocks under `src/app/shared/` before adding
  new abstractions.
- Keep presentation components focused on inputs, outputs, and view state.
- Move business logic into services, facades, or NgRx effects when appropriate.

### 2. NgRx state management

The root application state currently contains:

```typescript
interface AppState {
  router: RouterReducerState<BaseRouterStoreState>;
  authentication: AuthenticationState;
  error: ErrorState;
  layout: LayoutState;
  version: VersionState;
}
```

Key files:

- `src/app/store/app.state.ts`
- `src/app/store/app.reducers.ts`
- `src/app/store/app.effects.ts`
- `src/app/store/store.states.ts`
- `src/app/store/store.reducers.ts`
- `src/app/store/store.selectors.ts`
- `src/app/store/*/`

Best practices:

- Use selectors for store reads instead of reaching into state shape directly.
- Keep side effects in effects or services.
- When shared state changes, review actions, reducers, selectors, and effects
  together.
- Prefer extending an existing feature slice before creating a parallel store
  pattern or second state container.

### 3. Authentication flow

Authentication is JWT-based and includes:

- token handling via `@auth0/angular-jwt`
- route guards under `src/app/auth/guards/`
- auth routes under `src/app/auth/auth.routes.ts`
- authentication services under `src/app/auth/services/`
- NgRx authentication state under `src/app/store/authentication/`

### 4. Routing

The application uses standalone Angular routing and lazy route loading.
Feature routes live next to their features, for example:

- `src/app/app.routes.ts`
- `src/app/auth/auth.routes.ts`
- `src/app/auth/login/login.routes.ts`

### 5. HTTP interceptors

Cross-cutting HTTP behavior lives under `src/app/shared/interceptors/`, such as:

- accept-language handling
- backend version checks
- error handling
- HTTP caching

### 6. Internationalization

The project uses Transloco with translation files in `src/assets/i18n/`.
Current configured languages in `transloco.config.ts` are:

- `fi`
- `en`

Rules of thumb:

- new user-facing text should be translated
- keep `en.json` and `fi.json` in sync
- use the repository translation commands instead of editing drift manually

### 7. Theming and layout state

The layout store tracks UI-related state such as:

- theme
- language and locale
- timezone
- viewport and device information
- responsive flags such as desktop, tablet, and mobile
- anchor scroll target

## Development workflow

### Docker-first workflow

The primary local development workflow uses Docker Compose.
Common commands from project root:

```bash
make start
make start-immutable
make start-build
make start-production
make bash
make stop
```

Notes:

- `make start` starts the development container and Angular dev server
- `make start-immutable` enforces `yarn install --immutable` on startup
- `make start-production` uses the local production Angular configuration
- `make bash` opens a shell inside the `node` container
- once development is running, treat that `node` container as the default place
  to run project commands such as `yarn`, `ng`, linting, tests, and translation
  checks
- from the host shell, prefer the existing `make` targets that execute inside
  the running container instead of invoking project tooling directly on the host

### Dev Container workflow

The repository also supports Dev Containers through `.devcontainer/`.
Current configuration includes:

- forwarded port `4200`
- VS Code tasks for starting dev and local production modes
- the `node` service as the workspace container
- mounted host SSH and Git config for developer workflows

### Running without Docker

The repository includes direct Yarn scripts, but the documented workflow is
still Docker-first or Dev Container-first. If you run locally without Docker,
use the project root with Corepack-enabled Yarn:

```bash
yarn install

yarn start
yarn start-prod
```

### AI change reporting and commit policy

When AI assistants are used for repository changes:

- do not create commits unless a developer explicitly asks for a commit
- report a concise summary of changes after edits, including touched files and
  intent
- when a commit is requested, show the planned commit scope in the response
  before creating it

## Common tasks

```bash
# Linting
yarn lint:ts
yarn lint:scss
make lint

# Auto-fixing
yarn fix:ts
yarn fix:scss
make fix

# Testing
yarn test
yarn e2e

# Building
yarn build
yarn build-prod

# Translations
yarn extract-translations
yarn check-translations
yarn i18n:extract
yarn i18n:find
```

## CI and validation

### Current CI workflow

The main GitHub Actions workflow in `.github/workflows/main.yml` currently runs:

- TypeScript linting
- SCSS linting
- markdown documentation linting
- translation extraction drift checks
- untranslated text tag checks
- Docker image build
- Trivy vulnerability scanning on the built image

The reusable Yarn setup action pins a Node.js version and uses
`yarn install --immutable`.

### Preferred validation commands for AI-assisted changes

After changing code, prefer the smallest relevant validation set:

```bash
yarn lint:ts
yarn lint:scss
yarn test
yarn extract-translations
yarn check-translations
```

If you are using Docker or a Dev Container, run those commands inside the
containerized environment where the pinned Yarn setup is available. In the
documented local development workflow, that means the running `node` container.

## Configuration

### Angular build targets

The Angular workspace currently defines:

- default build target
- `production` build configuration
- `localProduction` build configuration
- Karma test target
- ESLint lint target
- Protractor E2E target

### TypeScript configuration

Strict TypeScript settings are enabled, including:

```json
{
  "strict": true,
  "strictTemplates": true,
  "strictInjectionParameters": true,
  "strictInputAccessModifiers": true
}
```

### Runtime configuration

Runtime and environment-related files include:

- `src/environments/environment.ts`
- `src/environments/environment.local-prod.ts`
- `src/environments/environment.prod.ts`
- `src/assets/config/config.dev.json`
- `src/assets/config/config.prod.json`

## Key conventions

### Naming and organization

- use feature-based folders under `src/app/`
- keep barrel exports where the repository already uses them
- follow existing file naming such as `*.component.ts`, `*.service.ts`,
  `*.guard.ts`, and `*.state.ts`

### Angular and RxJS style

- prefer reactive patterns over imperative component logic
- keep side effects out of presentation components
- reuse Angular Material and existing shared components first
- preserve current import ordering and linting conventions

### State management style

- preserve immutability in reducers
- use selectors for memoized state access
- keep effects focused on side effects
- update related store layers together when shared behavior changes

### Styling and UI

- use SCSS and existing repository conventions
- prefer Angular Material before new UI libraries
- avoid hardcoded user-facing text when it should be translated

## Backend integration

The default local backend assumption remains:

- frontend at `https://localhost:4200`
- backend at `https://localhost:8000`

The frontend expects a backend that provides compatible REST endpoints,
authentication, and version-related behavior.

## Testing strategy

### Unit tests

- test runner: Karma
- framework: Jasmine
- test files: `*.spec.ts`

### E2E tests

- Protractor configuration lives in `e2e/protractor.conf.js`
- Angular workspace still contains an E2E target
- treat Protractor as legacy and verify whether it should be retained or
  migrated before investing heavily in new E2E coverage

## Common issues and notes

### SSL certificates

The development server uses self-signed SSL certificates from `docker/ssl/`.
First-time setup may require trusting the local certificate chain.

### Package manager expectations

The repository pins its package manager via the `packageManager` field in
`package.json`. Use Corepack-enabled Yarn rather than a globally mismatched
package manager version.

### Documentation drift

This file is long-form context, not the only rules source. Keep it aligned with:

- `.github/copilot-instructions.md`
- `doc/AI_RULES.md`
- `.github/pull_request_template.md`
- actual repository scripts and CI workflows

## Practical guidance for AI assistants

When making changes in this repository:

1. Use standalone Angular patterns.
2. Follow existing NgRx actions, reducers, selectors, and effects structure.
3. Prefer selectors for all shared state reads.
4. Keep side effects in effects or services.
5. Reuse existing shared components, directives, pipes, and services first.
6. Add translations for new user-facing text in both `en.json` and `fi.json`.
7. Prefer the smallest change that fully solves the task.
8. Avoid unrelated refactors unless explicitly required.
9. Run the smallest relevant validation commands for the files you changed
   inside the running `node` container.
10. Use Docker or Dev Container workflows when local tool availability is
    uncertain.

---

*This document is maintained for AI assistants and contributors who need a
high-level map of the project's architecture, workflow, and repository
conventions.*
