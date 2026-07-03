# What is this?

This document defines repository-level AI usage rules for change quality,
architecture alignment, and workflow expectations.

Use these rules together with `.github/copilot-instructions.md` and `CLAUDE.md`
to keep AI-assisted changes consistent with existing project conventions.

## Table of Contents [ᐞ](#table-of-contents)

<a id="table-of-contents"></a>

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Why this document exists](#why-this-document-exists)
  * [Rule hierarchy](#rule-hierarchy)
  * [Scope](#scope)
  * [Core repository rules](#core-repository-rules)
    * [1. Follow the current Angular architecture](#1-follow-the-current-angular-architecture)
    * [2. Respect NgRx boundaries](#2-respect-ngrx-boundaries)
    * [3. Respect strict TypeScript](#3-respect-strict-typescript)
    * [4. Keep UI and styling consistent](#4-keep-ui-and-styling-consistent)
    * [5. Keep translations complete](#5-keep-translations-complete)
    * [6. Keep changes small and relevant](#6-keep-changes-small-and-relevant)
    * [7. Use the running development container for project commands](#7-use-the-running-development-container-for-project-commands)
    * [8. Keep versioned documentation lightweight](#8-keep-versioned-documentation-lightweight)
    * [9. Require explicit commit requests and clear change summaries](#9-require-explicit-commit-requests-and-clear-change-summaries)
    * [10. Ask for human clarification instead of assuming](#10-ask-for-human-clarification-instead-of-assuming)
    * [11. Update relevant documentation with code changes](#11-update-relevant-documentation-with-code-changes)
  * [Enforcement model](#enforcement-model)
    * [Documentation-only rules](#documentation-only-rules)
    * [Automatically enforceable rules](#automatically-enforceable-rules)
  * [Current validation commands](#current-validation-commands)
  * [Current CI alignment](#current-ci-alignment)
  * [Recommended maintenance workflow](#recommended-maintenance-workflow)
  * [Contributor workflow for AI-assisted changes](#contributor-workflow-for-ai-assisted-changes)
  * [CI strategy for recurring AI mistakes](#ci-strategy-for-recurring-ai-mistakes)
    * [Examples of enforceable AI rules for this repository](#examples-of-enforceable-ai-rules-for-this-repository)
  * [Good rule-writing patterns](#good-rule-writing-patterns)
  * [Suggested next improvements](#suggested-next-improvements)
  * [Related files](#related-files)

## Why this document exists [ᐞ](#table-of-contents)

<a id="why-this-document-exists"></a>

This repository already has strong technical conventions, linting, translation
checks, and CI workflows. This document defines how to turn those conventions
into practical rules for AI-assisted changes.

The goal is simple:

* improve the quality of AI-generated changes,
* reduce repository drift,
* keep changes aligned with Angular and NgRx project patterns, and
* back important rules with automated checks whenever possible.

## Rule hierarchy [ᐞ](#table-of-contents)

<a id="rule-hierarchy"></a>

Use the following order of precedence when maintaining AI guidance:

1. System or tool-level safety and platform rules
2. Repository instruction files such as `.github/copilot-instructions.md`
3. Project context and architecture guidance in `CLAUDE.md`
4. Existing code, lint rules, tests, and CI workflows as the final source of
   truth for implementation details

If a rule in a documentation file conflicts with the existing codebase or CI,
update the documentation or the implementation so that they match.

## Scope [ᐞ](#table-of-contents)

<a id="scope"></a>

These rules apply to AI-assisted changes in the repository, including:

* code generation,
* refactoring,
* documentation updates,
* translation updates,
* tests, and
* dependency changes.

## Core repository rules [ᐞ](#table-of-contents)

<a id="core-repository-rules"></a>

### 1. Follow the current Angular architecture [ᐞ](#table-of-contents)

<a id="1-follow-the-current-angular-architecture"></a>

* Use standalone components.
* Do not introduce NgModules.
* Place new code under the existing feature-based structure in `src/app/`.
* Prefer existing shared building blocks under `src/app/shared/` before adding
  new ones.

### 2. Respect NgRx boundaries [ᐞ](#table-of-contents)

<a id="2-respect-ngrx-boundaries"></a>

* Use actions, reducers, selectors, and effects consistently for shared state.
* Use selectors for state reads.
* Keep side effects in effects or services.
* Avoid placing stateful business logic directly in presentational components.
* When a shared state behavior changes, review the corresponding actions,
  reducers, selectors, and effects as one unit instead of patching only a
  single layer.

### 3. Respect strict TypeScript [ᐞ](#table-of-contents)

<a id="3-respect-strict-typescript"></a>

* Keep types explicit when inference is not clear.
* Avoid implicit `any`.
* Avoid weakening types simply to make code compile.
* Keep changes compatible with current lint and TypeScript rules.

### 4. Keep UI and styling consistent [ᐞ](#table-of-contents)

<a id="4-keep-ui-and-styling-consistent"></a>

* Prefer Angular Material and existing repository patterns.
* Follow the current SCSS structure and conventions.
* Avoid introducing new visual or styling patterns without a clear need.

### 5. Keep translations complete [ᐞ](#table-of-contents)

<a id="5-keep-translations-complete"></a>

Any new user-visible text must be reflected in both translation files:

* `src/assets/i18n/en.json`
* `src/assets/i18n/fi.json`

Translation-related changes should remain compatible with the repository's
translation extraction and validation commands.

### 6. Keep changes small and relevant [ᐞ](#table-of-contents)

<a id="6-keep-changes-small-and-relevant"></a>

* Prefer minimal, task-focused edits.
* Avoid unrelated refactors.
* Preserve public APIs unless the task requires a change.
* Reuse existing dependencies before proposing new ones.

### 7. Use the running development container for project commands [ᐞ](#table-of-contents)

<a id="7-use-the-running-development-container-for-project-commands"></a>

* Treat the running `node` container as the default environment for day-to-day
  development work.
* Run repository commands such as `yarn`, `ng`, lint, test, and translation
  checks inside that container.
* When working from the host shell, prefer the existing `make` targets that
  call into the running container rather than executing project tooling on the
  host directly.
* Reserve host-level command execution for tasks that genuinely belong to the
  host environment, such as Docker lifecycle or Git operations.

### 8. Keep versioned documentation lightweight [ᐞ](#table-of-contents)

<a id="8-keep-versioned-documentation-lightweight"></a>

* Avoid duplicating fast-changing dependency or tooling versions in long-form AI
  guidance when the repository already has a clear source of truth.
* Prefer referencing files such as `package.json`, `Dockerfile`,
  `.github/actions/setup-yarn/action.yml`, and `angular.json` instead of
  maintaining the same version numbers in multiple documents.
* If an exact version matters for a change, read it from the source file rather
  than assuming that a documentation file is current.

### 9. Require explicit commit requests and clear change summaries [ᐞ](#table-of-contents)

<a id="9-require-explicit-commit-requests-and-clear-change-summaries"></a>

* AI assistants must not create commits unless a developer explicitly requests
  a commit.
* After edits, AI responses should include a concise summary of what changed,
  why it changed, and which files were touched.
* That summary should include proposed commit message text for each logical
  change scope, following repository style (for example:
  `Chore(scope): short summary`).
* If a commit is requested, present the intended commit scope in the response
  before creating the commit.

### 10. Ask for human clarification instead of assuming [ᐞ](#table-of-contents)

<a id="10-ask-for-human-clarification-instead-of-assuming"></a>

* If requirements are missing, ambiguous, or policy-sensitive, AI assistants
  should ask the developer clarifying questions before implementation.
* Do not silently assume unspecified behavior, data contracts, UX wording, or
  acceptance criteria.
* If a temporary assumption is necessary to unblock progress, state it
  explicitly and ask for confirmation.

### 11. Update relevant documentation with code changes [ᐞ](#table-of-contents)

<a id="11-update-relevant-documentation-with-code-changes"></a>

* When code changes affect behavior, architecture, workflow, or contributor
  commands, update the relevant documentation in the same change.
* Keep repository AI guidance files aligned when policy-level instructions
  change: `.github/copilot-instructions.md`, `CLAUDE.md`, and `doc/AI_RULES.md`.
* If documentation is intentionally deferred, state that explicitly in the
  response with a reason.

## Enforcement model [ᐞ](#table-of-contents)

<a id="enforcement-model"></a>

Not all AI rules can be enforced automatically. Use the following model:

### Documentation-only rules [ᐞ](#table-of-contents)

<a id="documentation-only-rules"></a>

These are guidance-heavy and should remain concise and stable:

* prefer minimal edits,
* follow existing project patterns,
* keep business logic out of presentation components, and
* reuse existing shared building blocks first.

### Automatically enforceable rules [ᐞ](#table-of-contents)

<a id="automatically-enforceable-rules"></a>

These should be validated through repository tooling and CI whenever possible:

* TypeScript linting,
* SCSS linting,
* markdown documentation linting,
* translation extraction consistency,
* untranslated key detection, and
* build success.

## Current validation commands [ᐞ](#table-of-contents)

<a id="current-validation-commands"></a>

From repository root inside the running development container, the main
validation commands are:

```bash
yarn lint:ts
yarn lint:scss
yarn lint:md
yarn test
yarn extract-translations
yarn check-translations
```

## Current CI alignment [ᐞ](#table-of-contents)

<a id="current-ci-alignment"></a>

At the time of writing, `.github/workflows/main.yml` already includes checks
for:

* TypeScript linting,
* SCSS linting,
* markdown documentation linting,
* translation extraction drift, and
* untranslated text tags,
* Docker image build, and
* Trivy vulnerability scanning of the built image.

That means the most effective starting point for AI rules in this repository is
not more process, but clearer instruction files that map directly to these
existing checks.

## Recommended maintenance workflow [ᐞ](#table-of-contents)

<a id="recommended-maintenance-workflow"></a>

When a repeated AI mistake appears, follow this sequence:

1. Decide whether the issue is a one-off or a recurring pattern.
2. If recurring, add or tighten a short repository rule.
3. If possible, back that rule with linting, tests, or CI.
4. Keep the rule short, concrete, and tied to a repository path or command.
5. Remove or simplify rules that no longer reflect the codebase.

As a practical default, update the AI rules when the same architectural or
review comment appears multiple times, or when a new project convention is added
that AI assistants should follow by default.

## Contributor workflow for AI-assisted changes [ᐞ](#table-of-contents)

<a id="contributor-workflow-for-ai-assisted-changes"></a>

When using AI assistance in this repository, keep the workflow lightweight:

1. Start with `.github/copilot-instructions.md` for short operational rules.
2. Use `CLAUDE.md` when you need broader project context or architecture notes.
3. Make the smallest change that fits existing Angular, NgRx, and i18n
   patterns.
4. Run the smallest relevant validation commands for the files you changed
   inside the running development container.
5. Use `.github/pull_request_template.md` as the review checklist when opening
   pull requests.
6. If a reviewer repeats the same correction pattern, update the AI guidance so
   future changes start from the improved rule.
7. Do not create commits unless a developer explicitly asks for one, and always
   include a concise change summary in the response.
8. Include proposed commit message text in that summary, following the
   repository's commit subject style.
9. Ask clarifying questions when requirements are unclear; do not proceed on
   silent assumptions.
10. Update relevant documentation when implementation changes affect documented
   behavior, architecture, workflow, or contributor guidance.

## CI strategy for recurring AI mistakes [ᐞ](#table-of-contents)

<a id="ci-strategy-for-recurring-ai-mistakes"></a>

When the same AI-generated mistake appears repeatedly, prefer converting that
problem into an automated repository check instead of relying only on reviewer
memory.

Use this progression:

1. Document the rule in `.github/copilot-instructions.md` if it should affect
   day-to-day AI output.
2. Add or update tests, lint rules, or workflow checks if the mistake is
   machine-detectable.
3. Keep the check close to the existing project tool that already owns that
   concern.

For this repository, the preferred enforcement order is:

* ESLint for TypeScript, Angular, and NgRx usage patterns,
* Stylelint for SCSS issues,
* unit tests for behavior and state flow,
* translation extraction and translation validation for i18n drift, and
* GitHub Actions workflow updates only when the existing commands are not
  enough.

Examples:

* If AI keeps bypassing selectors and reading store shape directly, prefer an
  ESLint or NgRx rule before adding more documentation text.
* If AI keeps introducing untranslated user-facing strings, keep translation
  checks in CI and tighten review guidance around `en.json` and `fi.json`.
* If AI keeps changing behavior without updating tests, add or expand targeted
  unit tests in the affected feature.

Before adding a new CI rule, check that it is:

* specific to a recurring problem,
* understandable from the failure output,
* aligned with the current architecture, and
* unlikely to create noisy false positives.

Prefer extending existing jobs in `.github/workflows/main.yml` over creating a
new workflow unless the new check has a clearly different lifecycle or runtime
need.

### Examples of enforceable AI rules for this repository [ᐞ](#table-of-contents)

<a id="examples-of-enforceable-ai-rules-for-this-repository"></a>

These are good candidates when a recurring AI mistake becomes common enough to
justify automation:

* Require selector-based store reads instead of direct state shape access where
  existing NgRx lint rules or custom linting can detect the pattern.
* Require translation updates when new user-facing text is introduced in
  templates or components.
* Require affected unit tests to be updated when reducers, effects, or feature
  behavior changes.
* Require existing shared Angular Material or shared component patterns to be
  reused before introducing new parallel UI abstractions, when that can be
  validated in review or supported by targeted lint guidance.

Not every example needs immediate automation. Use them as a backlog of likely
enforcement candidates when the same class of AI-generated issue repeats.

## Good rule-writing patterns [ᐞ](#table-of-contents)

<a id="good-rule-writing-patterns"></a>

Prefer rules that are concrete and testable.

Better examples:

* New shared application state must use the existing NgRx structure under
  `src/app/store/`.
* New user-facing text must be added to both translation files.
* New UI should reuse Angular Material or existing shared components first.

Avoid vague rules such as:

* follow best practices,
* write clean code, or
* keep things consistent.

## Suggested next improvements [ᐞ](#table-of-contents)

<a id="suggested-next-improvements"></a>

After this first implementation, consider the following enhancements:

* evaluate which recurring AI issues from the examples section should become
  automated checks,
* tighten CI if a repeated class of regressions appears,
* add review checklist items for architectural exceptions, and
* periodically prune rules that duplicate lint or test enforcement.

## Related files [ᐞ](#table-of-contents)

<a id="related-files"></a>

* `README.md`
* `CLAUDE.md`
* `.github/copilot-instructions.md`
* `.github/pull_request_template.md`
* `.github/workflows/main.yml`

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
