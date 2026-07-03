# What is this?

This document defines repository-level Copilot operating instructions.

## Purpose [ᐞ](#table-of-contents)

<a id="purpose"></a>

Use these instructions as the repository-level default when proposing or making
changes in this project. Keep changes aligned with the existing Angular, NgRx,
and project workflow conventions.

## Table of Contents [ᐞ](#table-of-contents)

<a id="table-of-contents"></a>

* [What is this?](#what-is-this)
  * [Purpose](#purpose)
  * [Table of Contents](#table-of-contents)
  * [Architecture rules](#architecture-rules)
  * [TypeScript and Angular rules](#typescript-and-angular-rules)
  * [UI, styling, and i18n rules](#ui-styling-and-i18n-rules)
  * [Change scope rules](#change-scope-rules)
  * [Documentation maintenance rules](#documentation-maintenance-rules)
  * [Git and reporting rules](#git-and-reporting-rules)
  * [Clarification and assumptions rules](#clarification-and-assumptions-rules)
  * [Command execution rules](#command-execution-rules)
  * [Validation rules](#validation-rules)
  * [Reference documentation](#reference-documentation)

## Architecture rules [ᐞ](#table-of-contents)

<a id="architecture-rules"></a>

* Use standalone Angular components; do not introduce NgModules.
* Follow the existing feature-based structure under `src/app/`.
* Keep shared application state changes in the existing NgRx store structure
  under `src/app/store/`.
* Use selectors for store reads instead of reaching into state shape directly.
* Keep side effects in effects or services, not in presentation components.
* When a shared state feature changes, update the related actions, reducers,
  selectors, and effects together when needed.
* Prefer extending an existing feature slice before creating a new store pattern
  or parallel state container.

## TypeScript and Angular rules [ᐞ](#table-of-contents)

<a id="typescript-and-angular-rules"></a>

* Respect TypeScript strict mode and prefer strongly typed APIs.
* Avoid implicit `any` and unnecessary type assertions.
* Reuse existing Angular Material, shared components, directives, pipes, and
  services before adding new patterns.
* Prefer reactive Angular and RxJS patterns over imperative component logic.
* Keep presentation components focused on inputs, outputs, and view state; move
  business logic into services, facades, or NgRx effects where appropriate.
* Preserve existing import ordering and linting conventions.

## UI, styling, and i18n rules [ᐞ](#table-of-contents)

<a id="ui-styling-and-i18n-rules"></a>

* Use Angular Material components already present in the project before adding
  new UI dependencies.
* Follow existing SCSS patterns and naming conventions.
* Any new user-facing text must be added to both:
  * `src/assets/i18n/en.json`
  * `src/assets/i18n/fi.json`
* Avoid hardcoded user-facing strings in templates and components when they
  should be translated.

## Change scope rules [ᐞ](#table-of-contents)

<a id="change-scope-rules"></a>

* Prefer the smallest change that fully solves the task.
* Do not refactor unrelated code unless the task requires it.
* Do not introduce new dependencies unless they are necessary and justified.
* Preserve public APIs and existing architecture unless the task explicitly
  requires a change.

## Documentation maintenance rules [ᐞ](#table-of-contents)

<a id="documentation-maintenance-rules"></a>

* When codebase behavior, architecture, workflow, or contributor-facing commands
  change, update the relevant documentation in the same change.
* Keep `.github/copilot-instructions.md`, `CLAUDE.md`, and `doc/AI_RULES.md`
  aligned when repository-level AI policies change.
* If a documentation update is intentionally deferred, state that explicitly in
  the response with the reason.

## Git and reporting rules [ᐞ](#table-of-contents)

<a id="git-and-reporting-rules"></a>

* Do not create commits unless the developer explicitly asks for a commit.
* After making edits, provide a concise summary of what changed and why,
  including touched file paths.
* In that summary, propose commit message text for each logical change scope,
  following repository commit style (for example: `Chore(scope): short summary`).
* Before creating a commit on request, present the planned commit scope in the
  response so the developer can review it.

## Clarification and assumptions rules [ᐞ](#table-of-contents)

<a id="clarification-and-assumptions-rules"></a>

* If required details are missing, ambiguous, or involve a product decision,
  ask the developer before implementing.
* Do not silently assume behavior, API contracts, UX text, or acceptance
  criteria when they are not defined.
* If a best-effort assumption is unavoidable, state it explicitly and ask the
  developer to confirm it.

## Command execution rules [ᐞ](#table-of-contents)

<a id="command-execution-rules"></a>

* Treat the running `node` development container as the default environment for
  development commands.
* Run `yarn`, `ng`, lint, test, translation, and similar project commands
  inside the running container, not on the host machine.
* If starting from the host, prefer the existing `make` targets that delegate
  into the running container.
* Only run project commands directly on the host when the task explicitly
  requires host-level Docker or Git operations.

## Validation rules [ᐞ](#table-of-contents)

<a id="validation-rules"></a>

After changing code, prefer running the smallest relevant validation set from
project root inside the running development container:

* `yarn lint:ts`
* `yarn lint:scss`
* `yarn lint:md`
* `yarn test`
* `yarn extract-translations`
* `yarn check-translations`

## Reference documentation [ᐞ](#table-of-contents)

<a id="reference-documentation"></a>

For deeper project context, architecture notes, and workflow details, use
`CLAUDE.md` as the long-form reference document.

For guidance on maintaining AI policy files and turning recurring issues into
validation or CI checks, use `doc/AI_RULES.md`.

---

[Back to resources index](../doc/README.md) - [Back to main README.md](../README.md)
